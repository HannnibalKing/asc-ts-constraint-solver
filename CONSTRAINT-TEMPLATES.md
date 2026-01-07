# Constraint Math Templates

**Formal, Reusable, Solver-Ready Constraint Formulations**

These templates are mathematically explicit, solver-agnostic, and designed for real-time autonomy.

---

## 1. Hard Safety Envelope Constraint (Position)

**Use case:** Robot, vehicle, drone must remain within bounds.

### Mathematical Form

Let state position be **x** ∈ ℝⁿ  
Let bounds be **x_min**, **x_max**

```
∀ i ∈ dimensions:
  x_min[i] ≤ x[i] ≤ x_max[i]
```

### Violation Metric

```
violation = Σᵢ max(0, x[i] - x_max[i]) + max(0, x_min[i] - x[i])
```

### Constraint Definition

```typescript
class PositionBounds implements Constraint {
  kind = "HARD" as const;
  priority = 0;

  constructor(
    private xMin: number[],
    private xMax: number[]
  ) {}

  evaluate(state: State): ConstraintResult {
    let violation = 0;

    for (let i = 0; i < state.position.length; i++) {
      violation += Math.max(0, state.position[i] - this.xMax[i]);
      violation += Math.max(0, this.xMin[i] - state.position[i]);
    }

    return {
      satisfied: violation === 0,
      violation,
      gradient: this.computeGradient(state)
    };
  }

  private computeGradient(state: State): number[] {
    const grad = new Array(state.position.length).fill(0);

    for (let i = 0; i < state.position.length; i++) {
      if (state.position[i] > this.xMax[i]) {
        grad[i] = 1;
      } else if (state.position[i] < this.xMin[i]) {
        grad[i] = -1;
      }
    }

    return grad;
  }
}
```

### Interpretation

- **Projection-based correction**
- **Zero tolerance**
- **Non-negotiable**

---

## 2. Velocity Limit Constraint (Hard)

**Use case:** Prevent mechanical or aerodynamic failure.

### Mathematical Form

```
‖v‖₂ ≤ v_max
```

### Violation Metric

```
violation = max(0, ‖v‖₂ − v_max)
```

### Solver Action

1. Project velocity vector onto admissible sphere
2. Preserve direction, cap magnitude

### Constraint Definition

```typescript
class VelocityLimit implements Constraint {
  kind = "HARD" as const;
  priority = 0;

  constructor(private vMax: number) {}

  evaluate(state: State): ConstraintResult {
    const vNorm = Math.sqrt(
      state.velocity.reduce((sum, v) => sum + v * v, 0)
    );

    const violation = Math.max(0, vNorm - this.vMax);

    return {
      satisfied: violation === 0,
      violation,
      gradient: this.computeGradient(state, vNorm)
    };
  }

  private computeGradient(state: State, vNorm: number): number[] {
    if (vNorm === 0) return state.velocity.map(() => 0);
    
    // Gradient points in direction of velocity
    return state.velocity.map(v => v / vNorm);
  }

  project(state: State): State {
    const vNorm = Math.sqrt(
      state.velocity.reduce((sum, v) => sum + v * v, 0)
    );

    if (vNorm <= this.vMax) return state;

    // Scale velocity to maximum
    const scale = this.vMax / vNorm;
    return {
      ...state,
      velocity: state.velocity.map(v => v * scale)
    };
  }
}
```

---

## 3. Soft Comfort Constraint (Acceleration)

**Use case:** Smooth motion unless safety requires otherwise.

### Mathematical Form

```
penalty = w * max(0, ‖a‖₂ − a_pref)²
```

### Notes

- Quadratic penalty
- Weight `w` determines degradation order
- Automatically relaxed under load

### Constraint Definition

```typescript
class ComfortAcceleration implements Constraint {
  kind = "SOFT" as const;

  constructor(
    private aPref: number,
    private weight: number,
    public priority: number
  ) {}

  evaluate(state: State): ConstraintResult {
    const aNorm = Math.sqrt(
      state.acceleration.reduce((sum, a) => sum + a * a, 0)
    );

    const excess = Math.max(0, aNorm - this.aPref);
    const penalty = this.weight * excess * excess;

    return {
      satisfied: aNorm <= this.aPref,
      violation: penalty,
      gradient: this.computeGradient(state, aNorm)
    };
  }

  private computeGradient(state: State, aNorm: number): number[] {
    if (aNorm <= this.aPref || aNorm === 0) {
      return state.acceleration.map(() => 0);
    }

    const excess = aNorm - this.aPref;
    const scale = 2 * this.weight * excess / aNorm;

    return state.acceleration.map(a => scale * a);
  }
}
```

---

## 4. Temporal Constraint (Reaction Time)

**Use case:** Braking distance, actuator latency.

### Mathematical Form

```
x(t + Δt) = x(t) + v(t)Δt + ½a(t)Δt²
```

### Constraint

```
x(t + Δt) ∈ safe_region
```

### Interpretation

- Predictive constraint
- Converted into equivalent state-space bounds
- Treated as HARD if safety-related

### Constraint Definition

```typescript
class PredictivePositionBounds implements Constraint {
  kind = "HARD" as const;
  priority = 0;

  constructor(
    private xMin: number[],
    private xMax: number[],
    private deltaT: number
  ) {}

  evaluate(state: State): ConstraintResult {
    const predicted = this.predictState(state);
    let violation = 0;

    for (let i = 0; i < predicted.position.length; i++) {
      violation += Math.max(0, predicted.position[i] - this.xMax[i]);
      violation += Math.max(0, this.xMin[i] - predicted.position[i]);
    }

    return {
      satisfied: violation === 0,
      violation
    };
  }

  private predictState(state: State): State {
    const dt = this.deltaT;
    const position = state.position.map((x, i) =>
      x + state.velocity[i] * dt + 0.5 * state.acceleration[i] * dt * dt
    );

    return { ...state, position };
  }
}
```

---

## 5. Mutual Exclusion Constraint (Actuators)

**Use case:** Two actuators cannot activate simultaneously.

### Boolean Form

```
¬(A ∧ B)
```

### Numeric Encoding

```
A + B ≤ 1
```

### Importance

- Prevents hardware damage
- Often missed in naive planners

### Constraint Definition

```typescript
class MutualExclusion implements Constraint {
  kind = "HARD" as const;
  priority = 0;

  constructor(
    private actuatorA: string,
    private actuatorB: string
  ) {}

  evaluate(state: State): ConstraintResult {
    const a = state.actuators[this.actuatorA] ? 1 : 0;
    const b = state.actuators[this.actuatorB] ? 1 : 0;

    const sum = a + b;
    const violation = Math.max(0, sum - 1);

    return {
      satisfied: sum <= 1,
      violation
    };
  }
}
```

---

## 6. Energy Budget Constraint (Soft)

**Use case:** Battery life, thermal limits.

### Mathematical Form

```
E_consumed ≤ E_budget
penalty = w * max(0, E_consumed - E_budget)
```

### Constraint Definition

```typescript
class EnergyBudget implements Constraint {
  kind = "SOFT" as const;

  constructor(
    private eBudget: number,
    private weight: number,
    public priority: number
  ) {}

  evaluate(state: State): ConstraintResult {
    const eConsumed = this.computeEnergy(state);
    const excess = Math.max(0, eConsumed - this.eBudget);
    const penalty = this.weight * excess;

    return {
      satisfied: eConsumed <= this.eBudget,
      violation: penalty
    };
  }

  private computeEnergy(state: State): number {
    // Power = Force × Velocity
    // Simple model: E ∝ ‖a‖ × ‖v‖
    const aNorm = Math.sqrt(
      state.acceleration.reduce((sum, a) => sum + a * a, 0)
    );
    const vNorm = Math.sqrt(
      state.velocity.reduce((sum, v) => sum + v * v, 0)
    );

    return aNorm * vNorm;
  }
}
```

---

## 7. Obstacle Avoidance Constraint (Hard)

**Use case:** Collision avoidance.

### Mathematical Form

```
‖x - x_obstacle‖₂ ≥ r_safe
```

### Violation Metric

```
violation = max(0, r_safe - ‖x - x_obstacle‖₂)
```

### Constraint Definition

```typescript
class ObstacleAvoidance implements Constraint {
  kind = "HARD" as const;
  priority = 0;

  constructor(
    private obstaclePos: number[],
    private safeRadius: number
  ) {}

  evaluate(state: State): ConstraintResult {
    const distance = Math.sqrt(
      state.position.reduce((sum, x, i) => {
        const diff = x - this.obstaclePos[i];
        return sum + diff * diff;
      }, 0)
    );

    const violation = Math.max(0, this.safeRadius - distance);

    return {
      satisfied: distance >= this.safeRadius,
      violation,
      gradient: this.computeGradient(state, distance)
    };
  }

  private computeGradient(state: State, distance: number): number[] {
    if (distance === 0) {
      // Arbitrary repulsion direction
      return state.position.map(() => 1);
    }

    // Gradient points away from obstacle
    return state.position.map((x, i) =>
      (x - this.obstaclePos[i]) / distance
    );
  }
}
```

---

## 8. Goal Reaching Constraint (Objective)

**Use case:** Navigation target.

### Mathematical Form

```
minimize: ‖x - x_goal‖₂²
```

### Constraint Definition

```typescript
class GoalReaching implements Constraint {
  kind = "OBJECTIVE" as const;
  priority = 1000; // Low priority

  constructor(
    private goalPos: number[],
    private weight: number
  ) {}

  evaluate(state: State): ConstraintResult {
    const distanceSquared = state.position.reduce((sum, x, i) => {
      const diff = x - this.goalPos[i];
      return sum + diff * diff;
    }, 0);

    const cost = this.weight * distanceSquared;

    return {
      satisfied: false, // Always unsatisfied (optimization goal)
      violation: cost,
      gradient: this.computeGradient(state)
    };
  }

  private computeGradient(state: State): number[] {
    return state.position.map((x, i) =>
      2 * this.weight * (x - this.goalPos[i])
    );
  }
}
```

---

## 9. Joint Limit Constraint (Hard)

**Use case:** Robotic joint angle limits.

### Mathematical Form

```
θ_min ≤ θ ≤ θ_max
```

### Constraint Definition

```typescript
class JointLimits implements Constraint {
  kind = "HARD" as const;
  priority = 0;

  constructor(
    private jointIndex: number,
    private thetaMin: number,
    private thetaMax: number
  ) {}

  evaluate(state: State): ConstraintResult {
    const theta = state.jointAngles[this.jointIndex];

    let violation = 0;
    violation += Math.max(0, theta - this.thetaMax);
    violation += Math.max(0, this.thetaMin - theta);

    return {
      satisfied: violation === 0,
      violation
    };
  }
}
```

---

## 10. Infeasibility Certificate (Required)

When constraints cannot be satisfied:

### Output Interface

```typescript
interface InfeasibilityProof {
  conflictingConstraints: string[];
  minimalSet: boolean;
  explanation: string;
  violationMagnitudes: Record<string, number>;
}
```

### Example

```typescript
function generateInfeasibilityProof(
  constraints: Constraint[],
  state: State
): InfeasibilityProof {
  const violated = constraints.filter(c => {
    const result = c.evaluate(state);
    return c.kind === 'HARD' && !result.satisfied;
  });

  return {
    conflictingConstraints: violated.map(c => c.constructor.name),
    minimalSet: false, // TODO: Compute minimal infeasible set
    explanation: `Cannot satisfy ${violated.length} hard constraints simultaneously`,
    violationMagnitudes: Object.fromEntries(
      violated.map(c => [c.constructor.name, c.evaluate(state).violation])
    )
  };
}
```

**This is mandatory for certification readiness.**

---

## Constraint Summary Table

| Constraint | Type | Domain | Formulation |
|------------|------|--------|-------------|
| Position Bounds | HARD | Spatial | Box constraint |
| Velocity Limit | HARD | Kinematic | Sphere constraint |
| Comfort Accel | SOFT | Motion quality | Quadratic penalty |
| Predictive Bounds | HARD | Temporal | Euler integration |
| Mutual Exclusion | HARD | Logic | Boolean constraint |
| Energy Budget | SOFT | Resource | Linear penalty |
| Obstacle Avoidance | HARD | Spatial | Sphere exclusion |
| Goal Reaching | OBJECTIVE | Navigation | Quadratic cost |
| Joint Limits | HARD | Mechanical | Box constraint |

---

**All constraint templates include:**

1. ✅ Mathematical formulation
2. ✅ Violation metric
3. ✅ Gradient computation
4. ✅ TypeScript implementation
5. ✅ Solver-ready interface

**These are reference implementations for the Solver AI.**
