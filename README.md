# ASC-TS

**Autonomous Systems Constraint Solver (TypeScript)**

## Overview

ASC-TS is a real-time, safety-critical constraint solver designed for autonomous systems operating under strict physical, temporal, and safety constraints.

Unlike traditional optimizers, ASC-TS is built on a **safety-first autonomy model**:

- **Hard constraints are never violated.**
- **Optimization is optional.**
- **Explainability is mandatory.**

This project targets domains where failure is unacceptable:

- Robotics
- Autonomous vehicles
- Drones
- Industrial automation
- Space systems

## Design Philosophy

### 1. Safety Over Optimality

The solver prioritizes constraint satisfaction over performance or goal completion.

### 2. Real-Time Guarantees

Every solve cycle executes within a bounded time slice. When time expires, the solver returns the safest feasible state.

### 3. Determinism

Identical inputs always produce identical outputs. This enables reproducibility, replay, and certification.

### 4. Explainability

Every decision includes a human-auditable explanation describing:

- Active constraints
- Relaxed constraints
- Tradeoffs made
- Termination conditions

## Architecture

```
asc-ts/
 ├── core/         # Solver orchestration
 ├── constraints/  # Constraint definitions
 ├── solver/       # Optimization & projection
 ├── priority/     # Degradation logic
 ├── realtime/     # Deadline enforcement
 ├── explain/      # Decision tracing
 ├── verify/       # Safety verification
 └── visualize/    # Debug & audit tooling
```

## Constraint Model

Constraints are classified into three types:

- **HARD** – Must never be violated
- **SOFT** – May be degraded under pressure
- **OBJECTIVE** – Optimization goals

**Hard constraints dominate all decisions.**

### Example

```typescript
interface Constraint {
  id: string;
  kind: 'HARD' | 'SOFT' | 'OBJECTIVE';
  priority: number;          // lower = more important
  evaluate(state: State): ConstraintResult;
}
```

## Failure Handling

If no feasible solution exists:

1. The solver **explicitly reports infeasibility**
2. A **safe fallback state** is returned
3. A **full decision trace** is emitted

**Silent failure is impossible by design.**

## Core Execution Loop

```typescript
for (iteration = 0; iteration < maxIterations; iteration++) {
  const violations = evaluateConstraints(state);

  if (hardConstraintsSatisfied(violations)) {
    optimizeSoftConstraints(state);
  } else {
    enforceHardConstraints(state);
  }

  if (deadlineExceeded()) break;
}
```

## Real-Time Guarantees

```typescript
interface Deadline {
  maxMicros: number;
  hardStop: boolean;
}
```

The solver checks the clock every iteration. On hard stop:

- Returns safe output
- Reports explicit infeasibility

## Explainability Output

```typescript
interface DecisionTrace {
  violatedConstraints: string[];
  relaxedConstraints: string[];
  activeConstraints: string[];
  terminationReason: string;
}
```

**Every decision is traceable.**

## Non-Goals

This system explicitly **does not**:

- Use learning-based planning
- Employ black-box optimization
- Perform unbounded search
- Rely on probabilistic safety

## Installation

```bash
npm install
npm run build
```

## Testing

```bash
npm test                # Run all tests
npm run test:coverage   # Coverage report
npm run verify          # Full verification suite
```

## Usage Example

```typescript
import { ConstraintSolver } from './core/engine';
import { PositionBounds, VelocityLimit } from './constraints';

const solver = new ConstraintSolver({
  maxIterations: 100,
  deadline: { maxMicros: 200, hardStop: true }
});

solver.addConstraint(new PositionBounds([0, 10], 'HARD'));
solver.addConstraint(new VelocityLimit(5.0, 'HARD'));

const result = solver.solve(currentState);

if (result.infeasible) {
  console.error('No safe solution:', result.trace);
} else {
  console.log('Safe state:', result.state);
  console.log('Decision trace:', result.trace);
}
```

## Status

This system is under active development and intended as a **research-grade autonomy kernel**, not a consumer product.

The current implementation includes deterministic projection for built-in hard constraints and runtime state validation. Soft-constraint optimization, broader feasibility handling, and certification-level performance evidence remain unfinished.

## Safety Invariants (Non-Negotiable)

1. **Built-in HARD constraints are projected before a result is returned**; conflicting or non-projectable constraints remain an explicit limitation
2. **Solver execution must complete within bounded time**
3. **Every decision must be explainable**
4. **Determinism is mandatory** – no randomness without seeded control
5. **NaN or invalid states are fatal errors**

## Definition of "Done"

The system is complete when it:

- ✅ Handles ≥100 constraints in real time
- ✅ Meets sub-millisecond deadlines
- ⏳ Proves hard-constraint safety for all supported constraint combinations
- ✅ Produces explainable traces
- ✅ Degrades gracefully under overload

## License

MIT

## Contributing

See [MULTI-AGENT-WORKFLOW.md](MULTI-AGENT-WORKFLOW.md) for development protocols.

## Documentation

- [AI Task Prompts](AI-PROMPTS.md) – Execution contracts for specialized AIs
- [Torture Scenarios](TORTURE-SCENARIOS.md) – NASA-style failure analysis
- [Constraint Templates](CONSTRAINT-TEMPLATES.md) – Mathematical formulations
- [Multi-Agent Workflow](MULTI-AGENT-WORKFLOW.md) – Development protocol
- [Certification Framework](certification/README.md) – Safety audit artifacts

---

**This is a safety-critical autonomy kernel.**  
If the system ever chooses "better" over "safe," it has failed.
