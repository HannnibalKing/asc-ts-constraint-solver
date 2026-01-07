# Multi-Agent AI Development Workflow

**Collaborative Development Protocol for Safety-Critical Systems**

**Version:** 0.1.0  
**Date:** 2026-01-06

---

## 1. AI Role Definitions (Non-Overlapping)

| AI Role | Responsibility | Write Access | Read Access |
|---------|---------------|--------------|-------------|
| **Solver AI** | Math & optimization algorithms | `solver/`, `core/engine.ts` | All |
| **Verification AI** | Invariants, tests, runtime checks | `verify/`, `tests/` | All |
| **Explainability AI** | Decision traces, logging, auditing | `explain/` | All |
| **Systems AI** | Integration, orchestration, API | `core/`, `index.ts` | All |
| **Cert AI** | Reports, documentation, audits | `certification/` | All |

### Critical Rule

**Each AI has read-only access outside its domain.**

---

## 2. Change Control Protocol

Every change must include a **Change Manifest**:

```typescript
interface ChangeManifest {
  affectedConstraints: string[];
  determinismImpact: "NONE" | "LOW" | "HIGH";
  safetyImpact: "NONE" | "SOFT" | "HARD";
  verificationUpdated: boolean;
  testsCovered: string[];
}
```

### Blocking Conditions

Changes with `safetyImpact: "HARD"` **cannot merge** without:

1. ✅ Verification AI approval
2. ✅ New tests added
3. ✅ Certification AI sign-off

---

## 3. AI Review Gates

### Mandatory Review Flow

```
Solver AI → Verification AI → Explainability AI → Cert AI → Systems AI
```

**No AI may approve its own changes.**

### Review Criteria by AI

#### Verification AI Reviews

- ✅ All hard constraints still verified
- ✅ No new failure modes introduced
- ✅ Test coverage maintained

#### Explainability AI Reviews

- ✅ Decision traces complete
- ✅ Human-readable explanations updated
- ✅ Audit logs functional

#### Cert AI Reviews

- ✅ Safety impact documented
- ✅ Hazard analysis updated
- ✅ Certification artifacts current

#### Systems AI Reviews

- ✅ Interfaces preserved
- ✅ Module boundaries respected
- ✅ Integration tests pass

---

## 4. Automated AI Torture Loop

### Nightly Pipeline

Runs automatically every night at 02:00 UTC:

1. **Generate** random constraint sets (1000 variations)
2. **Inject** adversarial inputs:
   - NaN values
   - Conflicting constraints
   - Time pressure
3. **Run** solver under deadline pressure
4. **Verify**:
   - No hard constraint violations
   - Trace completeness
   - Determinism
5. **Report** failures → auto-generate certification reports

### Failure Escalation

| Severity | Action |
|----------|--------|
| CATASTROPHIC | Block all merges, alert all AIs |
| CRITICAL | Block solver changes, alert Verification AI |
| MAJOR | Flag for review |
| MODERATE | Log for next sprint |
| MINOR | Auto-file issue |

---

## 5. Human-in-the-Loop

### Human Roles

**You (Human Safety Engineer):**

- Final arbiter on HARD constraint semantics
- Approve architectural changes
- Own safety philosophy

**You do NOT:**

- Debug math
- Write solver code
- Verify implementations

### Human Review Required

Changes requiring human approval:

1. New constraint type definitions
2. Changes to safety invariants
3. Modifications to hard constraint semantics
4. Architectural rewrites

---

## 6. Conflict Resolution

### When AIs Disagree

1. **Document** both positions
2. **Escalate** to Systems AI
3. **Human** makes final call if still unresolved

### Example Conflict

**Solver AI:** "This optimization improves performance by 20%"  
**Verification AI:** "This optimization introduces non-determinism"

**Resolution:** Verification AI wins. Safety > performance.

---

## 7. Code Ownership Matrix

| Directory | Primary Owner | Review Required |
|-----------|---------------|-----------------|
| `core/engine.ts` | Solver AI | Verification AI |
| `core/types.ts` | Systems AI | All AIs |
| `solver/` | Solver AI | Verification AI |
| `constraints/` | Solver AI | Verification AI |
| `verify/` | Verification AI | Cert AI |
| `explain/` | Explainability AI | Cert AI |
| `certification/` | Cert AI | Human |

---

## 8. Development Phases

### Phase 1: Scaffolding (Week 1)

**Owner:** Systems AI

- ✅ Create directory structure
- ✅ Define interfaces
- ✅ Set up build system

### Phase 2: Core Solver (Week 2-4)

**Owner:** Solver AI

- Implement constraint evaluation
- Projection algorithms
- Optimization loop

**Required:** Verification AI shadow

### Phase 3: Verification (Week 5-6)

**Owner:** Verification AI

- Runtime checks
- Property-based tests
- Torture scenarios

### Phase 4: Explainability (Week 7)

**Owner:** Explainability AI

- Decision tracing
- Human-readable output
- Audit logs

### Phase 5: Certification (Week 8-9)

**Owner:** Cert AI

- Complete all reports
- Traceability matrix
- Final review

---

## 9. Communication Protocol

### Daily Standup (Async)

Each AI reports:

1. What I did yesterday
2. What I'm doing today
3. Blockers

### Blocking Another AI

If Verification AI blocks Solver AI:

1. **File** detailed issue
2. **Suggest** alternative approach
3. **Provide** test case that fails

---

## 10. Version Control Rules

### Branch Naming

- `solver/feature-name` – Solver AI
- `verify/feature-name` – Verification AI
- `explain/feature-name` – Explainability AI
- `cert/documentation-name` – Cert AI

### Commit Messages

```
[AI-NAME] Brief description

- Detailed change 1
- Detailed change 2

Safety Impact: [NONE | SOFT | HARD]
Verification: [test-id-1, test-id-2]
```

### Merge Requirements

| Safety Impact | Required Approvals |
|---------------|-------------------|
| NONE | 1 AI |
| SOFT | 2 AIs (including Verification AI) |
| HARD | 3 AIs (including Verification + Cert) + Human |

---

## 11. Definition of Done

A feature is **DONE** when:

1. ✅ Code written and tested
2. ✅ Verification tests pass
3. ✅ Explainability output validated
4. ✅ Certification artifacts updated
5. ✅ All AIs have reviewed
6. ✅ Torture scenarios pass

---

## 12. Emergency Stop Protocol

If **ANY** AI detects a safety violation:

1. **STOP** all development immediately
2. **ALERT** all AIs and human
3. **ROLLBACK** to last known safe state
4. **INVESTIGATE** root cause
5. **DOCUMENT** as failure report
6. **PREVENT** recurrence

---

## 13. AI Independence Verification

To ensure AIs are not duplicating work:

| Check | Frequency |
|-------|-----------|
| Module boundary violations | Every commit |
| Duplicate code | Weekly |
| Interface violations | Every PR |

---

## 14. Success Metrics

Project succeeds when:

1. ✅ All torture scenarios pass
2. ✅ Zero CATASTROPHIC defects
3. ✅ Zero CRITICAL defects
4. ✅ 100% safety test coverage
5. ✅ All certification artifacts complete
6. ✅ Human safety engineer approval

---

## 15. Example Workflow: Adding a New Constraint

### Step 1: Solver AI

1. Define constraint math
2. Implement `evaluate()` function
3. Add unit tests

### Step 2: Verification AI

1. Review for hard constraint violations
2. Add property-based tests
3. Update safety tests

### Step 3: Explainability AI

1. Add trace logging
2. Update human-readable formatter
3. Add constraint to documentation

### Step 4: Cert AI

1. Update hazard analysis
2. Add to verification matrix
3. Document in test plan

### Step 5: Systems AI

1. Integrate with solver
2. Run integration tests
3. Merge to main

---

## 16. Handoff Summary

**This is a safety-critical autonomy kernel.**

If the system ever chooses "better" over "safe," it has failed.

Multiple AIs working together must:

- Respect module boundaries
- Prioritize safety over all else
- Document every decision
- Never bypass verification

**No single AI can compromise safety.**

---

**Workflow approved by:**

- [ ] Solver AI
- [ ] Verification AI
- [ ] Explainability AI
- [ ] Systems AI
- [ ] Cert AI
- [ ] Human Safety Engineer

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1.0 | 2026-01-06 | Initial | First draft |
