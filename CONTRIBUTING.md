# Contributing to ASC-TS

**Development Guide for AI Contributors**

---

## For Programming AIs

If you are an AI contributing to ASC-TS, **read your role-specific prompt first:**

See [AI-PROMPTS.md](AI-PROMPTS.md) for:

- 🧠 Solver AI responsibilities
- 🛡️ Verification AI responsibilities
- 🔍 Explainability AI responsibilities
- 🔧 Systems AI responsibilities
- 📋 Certification AI responsibilities

**Then read [MULTI-AGENT-WORKFLOW.md](MULTI-AGENT-WORKFLOW.md)** for collaboration protocol.

---

## Quick Start for Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Build

```bash
npm run build
```

### 3. Run Tests

```bash
npm test
```

### 4. Run Examples

```bash
npm run build
node dist/examples/basic.js
node dist/examples/safety-critical.js
```

---

## Project Structure

```
asc-ts/
├── src/
│   ├── core/           # Solver orchestration (Systems AI)
│   ├── constraints/    # Constraint implementations (Solver AI)
│   ├── solver/         # Math algorithms (Solver AI)
│   ├── verify/         # Safety verification (Verification AI)
│   └── explain/        # Decision tracing (Explainability AI)
├── examples/           # Usage examples
├── certification/      # Safety artifacts (Cert AI)
└── docs/              # Additional documentation
```

---

## Development Workflow

### For Solver AI

1. Implement constraint math in `src/constraints/`
2. Add projection/optimization in `src/solver/`
3. Write unit tests
4. Request Verification AI review

### For Verification AI

1. Add runtime checks in `src/verify/`
2. Write property-based tests
3. Update torture scenarios
4. Verify determinism

### For Explainability AI

1. Enhance trace generation in `src/explain/`
2. Add human-readable formatters
3. Support new constraint types
4. Document trace schema

### For Systems AI

1. Maintain module boundaries
2. Update public API in `src/index.ts`
3. Run integration tests
4. Coordinate releases

### For Cert AI

1. Update certification documents
2. Track test coverage
3. Maintain traceability matrix
4. Generate audit reports

---

## Code Standards

### TypeScript Style

- **Strict mode:** Always enabled
- **No `any`:** Use proper types
- **Explicit returns:** Specify return types
- **Immutability:** Prefer const, avoid mutations

### Naming Conventions

- **Classes:** PascalCase (`PositionBounds`)
- **Functions:** camelCase (`validateState`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_ITERATIONS`)
- **Interfaces:** PascalCase (`State`, `Constraint`)

### Documentation

- **JSDoc:** All public APIs
- **Inline comments:** For complex math
- **Safety notes:** Mark critical sections

Example:

```typescript
/**
 * Validate state for safety-critical operations
 * 
 * CRITICAL: This function must be called before every solver iteration
 * 
 * @param state State to validate
 * @returns Validation result
 */
export function validateState(state: State): StateValidation {
  // Implementation
}
```

---

## Testing Requirements

### Unit Tests

- **Coverage:** ≥90% for safety-critical code
- **Framework:** Jest
- **Location:** `*.test.ts` next to source

Example:

```typescript
import { validateState } from './state';

describe('validateState', () => {
  test('detects NaN in position', () => {
    const state = {
      position: [NaN],
      velocity: [0],
      acceleration: [0],
      timestamp: 0,
    };
    
    const result = validateState(state);
    expect(result.valid).toBe(false);
  });
});
```

### Integration Tests

- Test multiple modules together
- Verify constraint + solver interaction
- Check trace completeness

### Property-Based Tests

- Randomized inputs
- Invariant verification
- Determinism checks

---

## Safety Checklist

Before submitting changes, verify:

- [ ] No hard constraint violations possible
- [ ] Determinism preserved (no `Math.random()`)
- [ ] NaN/Infinity checks in place
- [ ] Deadline enforcement respected
- [ ] Decision trace complete
- [ ] Tests cover safety scenarios
- [ ] Documentation updated

---

## Commit Message Format

```
[AI-NAME] Brief description (50 chars)

Detailed explanation of changes:
- Change 1
- Change 2

Safety Impact: [NONE | SOFT | HARD]
Verification: [test-id-1, test-id-2]
Reviewed-By: [AI-NAME]
```

Example:

```
[SOLVER-AI] Add quadratic constraint projection

- Implement QP-based projection for soft constraints
- Add gradient descent fallback
- Optimize for sparse constraints

Safety Impact: SOFT
Verification: CV-HARD-001, CV-SOFT-001
Reviewed-By: VERIFICATION-AI
```

---

## Pull Request Template

```markdown
## Summary
Brief description of changes

## Motivation
Why this change is needed

## Changes
- File 1: Description
- File 2: Description

## Safety Impact
- [ ] NONE - No safety impact
- [ ] SOFT - Affects soft constraints only
- [ ] HARD - Affects hard constraint enforcement

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Torture scenarios pass
- [ ] Determinism verified

## Verification
- [ ] Verification AI reviewed
- [ ] Certification docs updated
- [ ] Traceability matrix updated

## Reviewers
@verification-ai @cert-ai
```

---

## Common Pitfalls

### ❌ DON'T

- Modify hard constraint semantics without human approval
- Use `Math.random()` without deterministic seed
- Skip state validation
- Bypass verification checks
- Ignore deadline enforcement
- Return unsafe states

### ✅ DO

- Call `validateState()` before solving
- Check `isDeadlineExceeded()` every iteration
- Generate complete decision traces
- Write tests for safety scenarios
- Document mathematical assumptions
- Request reviews from other AIs

---

## Performance Guidelines

### Optimization Priorities

1. **Safety** – Never compromise
2. **Correctness** – Never compromise
3. **Real-time** – Meet deadlines
4. **Efficiency** – Optimize last

### Profiling

```bash
npm run build
node --prof dist/examples/benchmark.js
```

---

## Documentation

### Required Documentation

- **API docs:** JSDoc for all public functions
- **Math docs:** LaTeX formulas for algorithms
- **Safety docs:** Critical sections marked
- **Examples:** Usage demonstrations

### Documentation Locations

- **Code:** Inline JSDoc
- **Architecture:** `ARCHITECTURE.md`
- **Constraints:** `CONSTRAINT-TEMPLATES.md`
- **Testing:** `certification/test-plan.md`

---

## Release Process

### Version Numbering

- **Major (1.0.0):** Breaking API changes
- **Minor (0.1.0):** New features, backward compatible
- **Patch (0.0.1):** Bug fixes

### Pre-Release Checklist

- [ ] All tests pass
- [ ] All torture scenarios pass
- [ ] Determinism verified
- [ ] Timing benchmarks met
- [ ] Code coverage ≥80%
- [ ] Certification docs complete
- [ ] All AIs reviewed
- [ ] Human approval

---

## Getting Help

### For AIs

1. Check your role prompt: [AI-PROMPTS.md](AI-PROMPTS.md)
2. Review workflow: [MULTI-AGENT-WORKFLOW.md](MULTI-AGENT-WORKFLOW.md)
3. Read architecture: [ARCHITECTURE.md](ARCHITECTURE.md)
4. Check examples: `examples/`

### For Humans

1. Read README: [README.md](README.md)
2. Review safety docs: `certification/`
3. Check constraint templates: [CONSTRAINT-TEMPLATES.md](CONSTRAINT-TEMPLATES.md)

---

## License

MIT - See [LICENSE](LICENSE) file

---

**Remember: This is a safety-critical autonomy kernel.**

If the system ever chooses "better" over "safe," it has failed.
