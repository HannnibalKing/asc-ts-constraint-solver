# ASC-TS Architecture

**System Architecture & Design Decisions**

**Version:** 0.1.0  
**Date:** 2026-01-06

---

## 1. System Overview

ASC-TS is a modular, safety-critical constraint solver designed for real-time autonomous systems.

### Core Principles

1. **Safety First** – Hard constraints cannot be violated
2. **Real-Time** – Bounded execution time guaranteed
3. **Deterministic** – Identical inputs → identical outputs
4. **Explainable** – Every decision is auditable

---

## 2. Module Architecture

```
┌─────────────────────────────────────────┐
│          Public API (index.ts)          │
└────────────┬────────────────────────────┘
             │
    ┌────────┴────────┐
    ▼                 ▼
┌──────────┐    ┌──────────┐
│   Core   │    │Constraints│
│          │    │          │
│ Engine   │◄───┤  Basic   │
│ State    │    │ Advanced │
│ Types    │    │  Custom  │
└─┬──────┬─┘    └──────────┘
  │      │
  ▼      ▼
┌────┐ ┌────────┐
│Ver-│ │Explain │
│ify │ │        │
│    │ │ Trace  │
│Inv.│ │Format  │
└────┘ └────────┘
```

### Module Responsibilities

| Module | Responsibility | Owner |
|--------|---------------|-------|
| `core/` | Solver orchestration, types, state | Systems AI |
| `constraints/` | Constraint implementations | Solver AI |
| `solver/` | Math algorithms (projection, optimization) | Solver AI |
| `verify/` | Runtime safety checks | Verification AI |
| `explain/` | Decision tracing | Explainability AI |

---

## 3. Data Flow

### Solver Execution Flow

```
Input State
     │
     ▼
[Validate State] ──(invalid)──► Infeasible Result
     │
   (valid)
     │
     ▼
┌─────────────────────────┐
│   Solver Main Loop      │
│                         │
│  1. Check Deadline      │──(exceeded)──► Partial Result
│  2. Evaluate Constraints│
│  3. Enforce HARD        │
│  4. Optimize SOFT       │
│  5. Check Convergence   │──(converged)──► Final Result
│                         │
│  (repeat)               │──(max iter)───► Max Iter Result
└─────────────────────────┘
```

### Constraint Evaluation Pipeline

```
State ──► Constraint.evaluate() ──► ConstraintResult
                                     │
                                     ├─ satisfied: bool
                                     ├─ violation: number
                                     └─ gradient: Vector
```

---

## 4. Safety Architecture

### Layered Safety Model

```
┌──────────────────────────────────┐
│  Layer 4: Human Oversight        │ (Final arbiter)
├──────────────────────────────────┤
│  Layer 3: Certification AI       │ (Documentation)
├──────────────────────────────────┤
│  Layer 2: Verification AI        │ (Runtime checks)
├──────────────────────────────────┤
│  Layer 1: Solver Guarantees      │ (Hard constraint enforcement)
├──────────────────────────────────┤
│  Layer 0: State Validation       │ (NaN detection)
└──────────────────────────────────┘
```

### Critical Safety Checks

1. **Pre-Solve:** State validation (no NaN/Infinity)
2. **During Solve:** Hard constraint monitoring
3. **Post-Solve:** Result verification
4. **Always:** Deadline enforcement

---

## 5. Timing Architecture

### Real-Time Guarantees

```typescript
class DeadlineEnforcer {
  private startTime: number;
  private deadline: number;
  
  isExpired(): boolean {
    const elapsed = (performance.now() - this.startTime) * 1000;
    return elapsed >= this.deadline;
  }
}
```

### Timing Hierarchy

| Priority | Action |
|----------|--------|
| 1. Deadline check | Checked every iteration |
| 2. Hard constraint enforcement | Never skipped |
| 3. Soft constraint optimization | Skipped if time pressure |
| 4. Convergence refinement | Best effort |

---

## 6. Constraint Priority System

### Priority Levels

```
0-99    : HARD constraints (safety-critical)
100-999 : SOFT constraints (comfort, efficiency)
1000+   : OBJECTIVE (goals, targets)
```

### Priority Enforcement

Hard constraints are **NEVER** relaxed, regardless of:

- Numerical weight
- Optimization pressure
- Time constraints

---

## 7. Explainability Architecture

### Decision Trace Generation

```typescript
interface DecisionTrace {
  violatedConstraints: string[];    // What failed
  relaxedConstraints: string[];     // What was relaxed
  activeConstraints: string[];      // What was enforced
  terminationReason: string;        // Why stopped
  iterationCount: number;           // How many iterations
  timeBudgetUsed: number;          // How long (µs)
}
```

### Trace Output Formats

- **Human:** Formatted text explanation
- **Machine:** JSON export
- **Audit:** Timestamped log

---

## 8. Determinism Architecture

### Sources of Non-Determinism (Eliminated)

❌ `Math.random()` – No random without seed  
❌ Async operations – Single-threaded solver  
❌ Uninitialized memory – Strict initialization  
❌ Floating-point reordering – Fixed evaluation order

### Determinism Verification

```typescript
function verifyDeterminism(solver, state): boolean {
  const result1 = solver.solve(state);
  const result2 = solver.solve(state);
  
  return JSON.stringify(result1) === JSON.stringify(result2);
}
```

---

## 9. Error Handling Architecture

### Error Severity Classification

| Severity | Response | Example |
|----------|----------|---------|
| CATASTROPHIC | Throw immediately | Hard constraint violated |
| CRITICAL | Safe mode | Deadline exceeded |
| MAJOR | Warn and continue | Numerical instability |
| MODERATE | Log | Suboptimal solution |
| MINOR | Ignore | Performance hint |

### Error Propagation

```
Error Detected
     │
     ▼
[Classify Severity]
     │
  ┌──┴───┐
  ▼      ▼
CRITICAL  MODERATE
  │         │
  ▼         ▼
Throw     Log
```

---

## 10. Testing Architecture

### Test Pyramid

```
         ┌────────────┐
         │   E2E      │  Torture scenarios
         │            │  Full system tests
         ├────────────┤
         │Integration │  Solver + Verify
         │            │  Multi-constraint
         ├────────────┤
         │    Unit    │  Individual functions
         │            │  Constraint evaluation
         └────────────┘
```

### Coverage Requirements

- **Safety tests:** 100%
- **Hard constraint paths:** 100%
- **Overall code:** ≥80%

---

## 11. Future Extensions

### Planned Enhancements (v2.0)

1. **Advanced Solvers**
   - Quadratic programming
   - Sequential convex programming
   - SMT-backed feasibility

2. **Multi-Agent**
   - Distributed constraints
   - Consensus protocols

3. **Learning Integration**
   - Constraint learning (offline)
   - Parameter tuning (certified)

### Non-Goals

- Black-box ML inside solver
- Unbounded search
- Probabilistic safety

---

## 12. Performance Targets

| Constraints | Target Time | Frequency |
|-------------|------------|-----------|
| 10 | 50 µs | 20 kHz |
| 50 | 200 µs | 5 kHz |
| 100 | 500 µs | 2 kHz |
| 500 | 2 ms | 500 Hz |

---

## 13. Deployment Considerations

### Production Checklist

- [ ] All torture scenarios pass
- [ ] Determinism verified
- [ ] Timing benchmarks met
- [ ] Certification artifacts complete
- [ ] Code review approved
- [ ] Human safety engineer sign-off

---

**Architecture approved by:**

- [ ] Systems AI
- [ ] Solver AI
- [ ] Verification AI
- [ ] Human Safety Engineer

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1.0 | 2026-01-06 | Initial | Architecture specification |
