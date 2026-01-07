# Constraint Torture Scenarios

**NASA-Style Failure Analysis Test Cases**

These scenarios are designed to break weak solvers. They model real aerospace and robotics failure modes.

---

## 🚀 Scenario 1: Conflicting Hard Constraints (Impossible Physics)

### Description

A robotic arm is commanded to:

1. **Maintain zero velocity** (HARD)
2. **Reach a new position instantly** (HARD)

### Physical Interpretation

The system receives contradictory commands that violate fundamental physics.

### Expected Behavior

- ✅ Detect infeasibility
- ✅ Halt motion
- ✅ Emit conflict trace identifying both constraints

### Failure If

- ❌ Solver "chooses one" constraint arbitrarily
- ❌ Solver violates either constraint
- ❌ Silent failure or partial execution

### Test Code

```typescript
const c1 = new VelocityConstraint(0.0, 'HARD'); // v = 0
const c2 = new PositionConstraint(newPos, 'HARD'); // instant teleport
solver.addConstraint(c1);
solver.addConstraint(c2);

const result = solver.solve(state);

assert(result.infeasible === true);
assert(result.trace.violatedConstraints.includes('VelocityConstraint'));
assert(result.trace.violatedConstraints.includes('PositionConstraint'));
```

### Severity

**CATASTROPHIC** – Represents physical impossibility

---

## 🚀 Scenario 2: Time Budget Collapse

### Description

Solver is given:

- **500 constraints**
- **200 µs deadline**

### Expected Behavior

- ✅ Partial solve within deadline
- ✅ Safe projection to feasible state
- ✅ Explicit timeout reason: `"deadlineExceeded"`

### Failure If

- ❌ Solver overruns deadline
- ❌ Solver returns unsafe state
- ❌ No timeout explanation

### Test Code

```typescript
const solver = new ConstraintSolver({
  maxIterations: 10000,
  deadline: { maxMicros: 200, hardStop: true }
});

// Add 500 constraints
for (let i = 0; i < 500; i++) {
  solver.addConstraint(generateRandomConstraint(i));
}

const result = solver.solve(state);

assert(result.timeBudgetUsed <= 200);
assert(result.state.isValid());
assert(result.trace.terminationReason === 'deadlineExceeded');
```

### Severity

**CRITICAL** – Real-time deadline violation

---

## 🚀 Scenario 3: Priority Inversion Attack

### Description

A **low-priority soft constraint** numerically dominates a **hard constraint** due to weight scaling.

### Example

- Hard constraint: `x ≥ 0` (priority=0, weight=1)
- Soft constraint: `x = -100` (priority=100, weight=1e6)

### Expected Behavior

- ✅ Hard constraint enforced: `x ≥ 0`
- ✅ Soft constraint relaxed completely
- ✅ Trace shows relaxation

### Failure If

- ❌ Hard constraint violated due to numeric weight
- ❌ Solver prioritizes optimization over safety

### Test Code

```typescript
const hard = new PositionLowerBound(0.0, 'HARD', 0);
const soft = new PositionGoal(-100.0, 'SOFT', 100, 1e6);

solver.addConstraint(hard);
solver.addConstraint(soft);

const result = solver.solve({ position: -50 });

assert(result.state.position >= 0.0);
assert(result.trace.relaxedConstraints.includes('PositionGoal'));
```

### Severity

**CRITICAL** – Safety/optimization priority inversion

---

## 🚀 Scenario 4: Constraint Oscillation

### Description

Constraints alternate activation each iteration, causing solver to flip-flop endlessly.

### Example

- Constraint A: `x > 5` activates when `x ≤ 5`
- Constraint B: `x < 5` activates when `x ≥ 5`

### Expected Behavior

- ✅ Convergent behavior (settle on boundary)
- ✅ No oscillatory thrashing
- ✅ Deadline respected

### Failure If

- ❌ Solver flips state endlessly
- ❌ Deadline violated
- ❌ Non-deterministic output

### Test Code

```typescript
const c1 = new GreaterThan('x', 5.0, 'SOFT', 1);
const c2 = new LessThan('x', 5.0, 'SOFT', 1);

solver.addConstraint(c1);
solver.addConstraint(c2);

const result = solver.solve({ x: 4.9 });

assert(Math.abs(result.state.x - 5.0) < 1e-6); // Converged to boundary
assert(result.iterations < 100); // No thrashing
```

### Severity

**MAJOR** – Convergence failure

---

## 🚀 Scenario 5: Silent Degradation

### Description

Solver relaxes multiple soft constraints gradually without documentation.

### Expected Behavior

- ✅ Each relaxation logged
- ✅ Cumulative degradation visible in trace
- ✅ Human-readable explanation

### Failure If

- ❌ Relaxation is undocumented
- ❌ No explanation provided
- ❌ Black-box behavior

### Test Code

```typescript
const soft1 = new ComfortAccel(1.0, 'SOFT', 10);
const soft2 = new EnergyUsage(50.0, 'SOFT', 20);
const soft3 = new NoiseLevel(30.0, 'SOFT', 30);

solver.addConstraint(soft1);
solver.addConstraint(soft2);
solver.addConstraint(soft3);

const result = solver.solve(stressState);

assert(result.trace.relaxedConstraints.length > 0);
assert(result.trace.terminationReason.includes('softConstraintRelaxation'));
```

### Severity

**MODERATE** – Explainability failure

---

## 🚀 Scenario 6: NaN Injection (Real Aerospace Bug)

### Description

State contains `NaN` due to upstream sensor fault.

### Expected Behavior

- ✅ Immediate detection
- ✅ Safe-mode output (halt or last-known-good)
- ✅ Full trace with error details

### Failure If

- ❌ NaN propagates through solver
- ❌ Solver continues "normally"
- ❌ Invalid output returned

### Test Code

```typescript
const corruptedState = {
  position: NaN,
  velocity: 5.0,
  acceleration: 0.0
};

const result = solver.solve(corruptedState);

assert(result.infeasible === true);
assert(result.trace.terminationReason === 'invalidState');
assert(result.trace.violatedConstraints.includes('stateValidity'));
```

### Severity

**CATASTROPHIC** – Silent corruption

---

## 🚀 Scenario 7: Incremental Constraint Violation

### Description

A previously satisfied hard constraint becomes violated over multiple iterations.

### Expected Behavior

- ✅ Violation detected immediately
- ✅ Solver re-projects to feasible region
- ✅ Trace shows constraint re-activation

### Failure If

- ❌ Violation goes undetected
- ❌ Solver continues with violation
- ❌ No corrective action

### Test Code

```typescript
const bound = new PositionBounds([0, 10], 'HARD');
solver.addConstraint(bound);

let state = { position: 5.0 };

for (let i = 0; i < 20; i++) {
  state = solver.solve(state).state;
  state.position += 0.6; // Drift toward boundary

  assert(state.position >= 0.0 && state.position <= 10.0);
}
```

### Severity

**CRITICAL** – Constraint regression

---

## 🚀 Scenario 8: Constraint Priority Conflict

### Description

Two hard constraints with different priorities conflict.

### Expected Behavior

- ✅ Both constraints enforced (infeasibility detected)
- ✅ No priority-based relaxation of hard constraints
- ✅ Explicit conflict report

### Failure If

- ❌ Lower-priority hard constraint relaxed
- ❌ Silent conflict resolution
- ❌ Safety degradation

### Test Code

```typescript
const c1 = new PositionConstraint(0.0, 'HARD', 0);
const c2 = new PositionConstraint(10.0, 'HARD', 1);

solver.addConstraint(c1);
solver.addConstraint(c2);

const result = solver.solve(state);

assert(result.infeasible === true);
assert(result.trace.violatedConstraints.length === 2);
```

### Severity

**CATASTROPHIC** – Hard constraint relaxation

---

## 🚀 Scenario 9: Numerical Instability

### Description

Constraints with vastly different scales (1e-9 vs 1e9) cause numerical errors.

### Expected Behavior

- ✅ Solver detects numerical instability
- ✅ Reports warning or rescales constraints
- ✅ No loss of precision on safety-critical constraints

### Failure If

- ❌ Silent precision loss
- ❌ Hard constraint violated due to floating-point error
- ❌ No detection mechanism

### Test Code

```typescript
const microConstraint = new ValueConstraint(1e-9, 'HARD');
const macroConstraint = new ValueConstraint(1e9, 'SOFT');

solver.addConstraint(microConstraint);
solver.addConstraint(macroConstraint);

const result = solver.solve(state);

assert(result.state.isValid());
assert(!result.trace.violatedConstraints.includes('microConstraint'));
```

### Severity

**MAJOR** – Numerical safety issue

---

## 🚀 Scenario 10: Determinism Verification

### Description

Identical inputs must produce identical outputs.

### Expected Behavior

- ✅ 100% deterministic solver output
- ✅ Bit-identical results across runs
- ✅ No hidden randomness

### Failure If

- ❌ Non-deterministic output
- ❌ Floating-point non-reproducibility
- ❌ Race conditions

### Test Code

```typescript
const state = generateRandomState(seed=42);
const constraints = generateRandomConstraints(seed=42);

const result1 = solver.solve(state, constraints);
const result2 = solver.solve(state, constraints);

assert(JSON.stringify(result1) === JSON.stringify(result2));
```

### Severity

**CRITICAL** – Determinism failure

---

## Summary Table

| Scenario | Type | Severity | Detection |
|----------|------|----------|-----------|
| Conflicting Hard Constraints | Safety | CATASTROPHIC | Infeasibility |
| Time Budget Collapse | Real-Time | CRITICAL | Deadline |
| Priority Inversion | Safety | CRITICAL | Violation |
| Constraint Oscillation | Convergence | MAJOR | Iteration count |
| Silent Degradation | Explainability | MODERATE | Trace missing |
| NaN Injection | Corruption | CATASTROPHIC | State validation |
| Incremental Violation | Regression | CRITICAL | Runtime check |
| Priority Conflict | Safety | CATASTROPHIC | Infeasibility |
| Numerical Instability | Precision | MAJOR | Tolerance check |
| Determinism | Reproducibility | CRITICAL | Comparison |

---

**These scenarios are mandatory for certification.**
