# ASC-TS Complete Index

**Navigation Guide for the Entire Project**

---

## 🎯 Start Here

| Document | When to Read |
|----------|-------------|
| [PROJECT-SUMMARY.md](PROJECT-SUMMARY.md) | **First** - Complete overview |
| [README.md](README.md) | Quick introduction to the project |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Understanding system design |

---

## 👥 For Programming AIs

### Your First Steps

1. **Read your role prompt:** [AI-PROMPTS.md](AI-PROMPTS.md)
   - Find your specific AI role (Solver, Verification, etc.)
   - Understand your responsibilities
   - Know what's forbidden

2. **Learn collaboration protocol:** [MULTI-AGENT-WORKFLOW.md](MULTI-AGENT-WORKFLOW.md)
   - Review gates
   - Change control
   - Conflict resolution

3. **Read your domain docs:**
   - **Solver AI:** [CONSTRAINT-TEMPLATES.md](CONSTRAINT-TEMPLATES.md)
   - **Verification AI:** [TORTURE-SCENARIOS.md](TORTURE-SCENARIOS.md)
   - **All AIs:** [ARCHITECTURE.md](ARCHITECTURE.md)

4. **Follow development guide:** [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 🧠 AI Role Quick Links

### Solver AI

**Responsibilities:** Math & optimization algorithms

**Read:**
- ✅ [AI-PROMPTS.md](AI-PROMPTS.md#solver-ai-prompt) (Your prompt)
- ✅ [CONSTRAINT-TEMPLATES.md](CONSTRAINT-TEMPLATES.md) (Math formulations)
- ✅ [ARCHITECTURE.md](ARCHITECTURE.md#constraint-priority-system)

**Work in:**
- `src/solver/` – Optimization algorithms
- `src/constraints/` – Constraint implementations

**Deliverables:**
- Hard constraint projection
- Soft constraint optimization
- Gradient descent implementation

---

### Verification AI

**Responsibilities:** Safety & runtime verification

**Read:**
- ✅ [AI-PROMPTS.md](AI-PROMPTS.md#verification-ai-prompt)
- ✅ [TORTURE-SCENARIOS.md](TORTURE-SCENARIOS.md) (Test scenarios)
- ✅ [certification/test-plan.md](certification/test-plan.md)

**Work in:**
- `src/verify/` – Runtime checks
- `__tests__/` – Test suites

**Deliverables:**
- Property-based tests
- Torture scenario implementations
- Determinism verification

---

### Explainability AI

**Responsibilities:** Decision traces & audit logs

**Read:**
- ✅ [AI-PROMPTS.md](AI-PROMPTS.md#explainability-ai-prompt)
- ✅ [ARCHITECTURE.md](ARCHITECTURE.md#explainability-architecture)

**Work in:**
- `src/explain/` – Trace engine

**Deliverables:**
- Enhanced trace formatting
- Conflict visualization
- Audit log export

---

### Systems AI

**Responsibilities:** Integration & orchestration

**Read:**
- ✅ [AI-PROMPTS.md](AI-PROMPTS.md#systems-integration-ai-prompt)
- ✅ [ARCHITECTURE.md](ARCHITECTURE.md)
- ✅ [CONTRIBUTING.md](CONTRIBUTING.md)

**Work in:**
- `src/core/` – Core orchestration
- `src/index.ts` – Public API

**Deliverables:**
- Module integration
- API design
- Build system

---

### Certification AI

**Responsibilities:** Documentation & safety artifacts

**Read:**
- ✅ [AI-PROMPTS.md](AI-PROMPTS.md#certification-ai-prompt)
- ✅ All certification docs below

**Work in:**
- `certification/` – All reports

**Deliverables:**
- Complete test reports
- Traceability matrices
- Safety case documentation

---

## 📚 Documentation Library

### Core Documentation

| Document | Purpose | Pages |
|----------|---------|-------|
| [README.md](README.md) | Project introduction | 📄 |
| [PROJECT-SUMMARY.md](PROJECT-SUMMARY.md) | Complete handoff package | 📄📄📄 |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design | 📄📄 |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Development guide | 📄📄 |
| [LICENSE](LICENSE) | MIT license + safety notice | 📄 |

### AI-Specific Documentation

| Document | Audience |
|----------|----------|
| [AI-PROMPTS.md](AI-PROMPTS.md) | All Programming AIs |
| [MULTI-AGENT-WORKFLOW.md](MULTI-AGENT-WORKFLOW.md) | All Programming AIs |

### Technical Documentation

| Document | Topic |
|----------|-------|
| [CONSTRAINT-TEMPLATES.md](CONSTRAINT-TEMPLATES.md) | Mathematical formulations |
| [TORTURE-SCENARIOS.md](TORTURE-SCENARIOS.md) | Failure test cases |

### Certification Documentation

| Document | Standard |
|----------|----------|
| [certification/README.md](certification/README.md) | Overview |
| [certification/test-plan.md](certification/test-plan.md) | DO-178C style |
| [certification/hazard-analysis.md](certification/hazard-analysis.md) | FMEA |
| [certification/constraint-verification.md](certification/constraint-verification.md) | Verification reports |
| [certification/timing-analysis.md](certification/timing-analysis.md) | Real-time analysis |
| [certification/failure-reports/TEMPLATE.md](certification/failure-reports/TEMPLATE.md) | Failure tracking |

---

## 💻 Code Structure

### Source Code Map

```
src/
├── core/
│   ├── types.ts          ← Type definitions
│   ├── state.ts          ← State validation
│   └── engine.ts         ← Solver orchestration
├── constraints/
│   └── basic.ts          ← Reference implementations
├── solver/               ← [TO BE IMPLEMENTED by Solver AI]
├── verify/
│   └── invariants.ts     ← Runtime checks
├── explain/
│   └── trace.ts          ← Decision tracing
└── index.ts              ← Public API
```

### Example Code

```
examples/
├── basic.ts              ← Simple usage
└── safety-critical.ts    ← Torture scenarios
```

---

## 🧪 Testing Documentation

### Test Plans

| Document | Coverage |
|----------|----------|
| [certification/test-plan.md](certification/test-plan.md) | Overall strategy |
| [TORTURE-SCENARIOS.md](TORTURE-SCENARIOS.md) | Failure modes |

### Test Implementation Status

⚠️ Most tests not yet implemented

**Next Steps:** Verification AI should implement test suite

---

## 🚀 Quick Reference

### Common Tasks

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Build project | `npm run build` |
| Run tests | `npm test` |
| Run linter | `npm run lint` |
| Format code | `npm run format` |
| Run example | `node dist/examples/basic.js` |

### File Quick Access

| Need to... | Go to... |
|------------|----------|
| Add a constraint | `src/constraints/basic.ts` |
| Modify solver | `src/core/engine.ts` |
| Add verification | `src/verify/invariants.ts` |
| Update API | `src/index.ts` |
| Write tests | Create `*.test.ts` file |
| Document failure | `certification/failure-reports/` |

---

## 🎓 Learning Path

### For New Contributors

1. **Day 1:** Read [PROJECT-SUMMARY.md](PROJECT-SUMMARY.md) and [README.md](README.md)
2. **Day 2:** Study [ARCHITECTURE.md](ARCHITECTURE.md)
3. **Day 3:** Review your role in [AI-PROMPTS.md](AI-PROMPTS.md)
4. **Day 4:** Read [MULTI-AGENT-WORKFLOW.md](MULTI-AGENT-WORKFLOW.md)
5. **Day 5:** Start implementing (follow [CONTRIBUTING.md](CONTRIBUTING.md))

### For Safety Engineers

1. Review [certification/hazard-analysis.md](certification/hazard-analysis.md)
2. Read [TORTURE-SCENARIOS.md](TORTURE-SCENARIOS.md)
3. Validate [certification/test-plan.md](certification/test-plan.md)
4. Approve safety invariants in [ARCHITECTURE.md](ARCHITECTURE.md)

### For Researchers

1. Study [CONSTRAINT-TEMPLATES.md](CONSTRAINT-TEMPLATES.md)
2. Review [ARCHITECTURE.md](ARCHITECTURE.md)
3. Examine [TORTURE-SCENARIOS.md](TORTURE-SCENARIOS.md)
4. Read research papers cited in docs

---

## 🔍 Search by Topic

### Safety

- [ARCHITECTURE.md](ARCHITECTURE.md#safety-architecture)
- [certification/hazard-analysis.md](certification/hazard-analysis.md)
- [TORTURE-SCENARIOS.md](TORTURE-SCENARIOS.md)
- [AI-PROMPTS.md](AI-PROMPTS.md#verification-ai-prompt)

### Real-Time

- [ARCHITECTURE.md](ARCHITECTURE.md#timing-architecture)
- [certification/timing-analysis.md](certification/timing-analysis.md)
- `src/core/engine.ts` (deadline enforcement)

### Constraints

- [CONSTRAINT-TEMPLATES.md](CONSTRAINT-TEMPLATES.md)
- `src/constraints/basic.ts`
- [AI-PROMPTS.md](AI-PROMPTS.md#solver-ai-prompt)

### Testing

- [certification/test-plan.md](certification/test-plan.md)
- [TORTURE-SCENARIOS.md](TORTURE-SCENARIOS.md)
- [AI-PROMPTS.md](AI-PROMPTS.md#verification-ai-prompt)

### Explainability

- `src/explain/trace.ts`
- [ARCHITECTURE.md](ARCHITECTURE.md#explainability-architecture)
- [AI-PROMPTS.md](AI-PROMPTS.md#explainability-ai-prompt)

---

## 📊 Project Status Dashboard

### ✅ Complete

- Project structure
- Type system
- Documentation framework
- Certification templates
- Multi-agent workflow
- Example implementations

### ⚠️ In Progress

- Solver algorithms (Solver AI)
- Test suite (Verification AI)
- Visualization (Explainability AI)

### 🔜 Not Started

- Advanced solvers
- Full certification
- Performance benchmarks

---

## 🎯 Critical Reading for Each Role

### If you're a Solver AI:

**Must Read:**
1. [AI-PROMPTS.md](AI-PROMPTS.md#solver-ai-prompt)
2. [CONSTRAINT-TEMPLATES.md](CONSTRAINT-TEMPLATES.md)
3. `src/core/types.ts`
4. `src/constraints/basic.ts`

### If you're a Verification AI:

**Must Read:**
1. [AI-PROMPTS.md](AI-PROMPTS.md#verification-ai-prompt)
2. [TORTURE-SCENARIOS.md](TORTURE-SCENARIOS.md)
3. [certification/test-plan.md](certification/test-plan.md)
4. `src/verify/invariants.ts`

### If you're an Explainability AI:

**Must Read:**
1. [AI-PROMPTS.md](AI-PROMPTS.md#explainability-ai-prompt)
2. [ARCHITECTURE.md](ARCHITECTURE.md#explainability-architecture)
3. `src/explain/trace.ts`

### If you're a Systems AI:

**Must Read:**
1. [AI-PROMPTS.md](AI-PROMPTS.md#systems-integration-ai-prompt)
2. [ARCHITECTURE.md](ARCHITECTURE.md)
3. [MULTI-AGENT-WORKFLOW.md](MULTI-AGENT-WORKFLOW.md)
4. `src/index.ts`

### If you're a Certification AI:

**Must Read:**
1. [AI-PROMPTS.md](AI-PROMPTS.md#certification-ai-prompt)
2. All files in `certification/`
3. [MULTI-AGENT-WORKFLOW.md](MULTI-AGENT-WORKFLOW.md)

---

## 📞 Getting Help

| Question | Answer Location |
|----------|----------------|
| What is ASC-TS? | [README.md](README.md) |
| How does it work? | [ARCHITECTURE.md](ARCHITECTURE.md) |
| What's my role? | [AI-PROMPTS.md](AI-PROMPTS.md) |
| How do I collaborate? | [MULTI-AGENT-WORKFLOW.md](MULTI-AGENT-WORKFLOW.md) |
| How do I contribute? | [CONTRIBUTING.md](CONTRIBUTING.md) |
| What are the safety requirements? | [certification/hazard-analysis.md](certification/hazard-analysis.md) |

---

**This index is your map. Use it to navigate the entire project.**

Everything is documented. Everything is organized. Start anywhere that makes sense for your role.

---

**Last Updated:** 2026-01-06  
**Status:** Complete and Ready for Development
