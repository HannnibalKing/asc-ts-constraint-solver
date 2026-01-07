# Hazard Analysis

**ASC-TS Failure Modes and Effects Analysis (FMEA)**

**Document ID:** HA-ASC-001  
**Version:** 0.1.0  
**Date:** 2026-01-06  
**Status:** Draft

---

## 1. Introduction

This document identifies potential failure modes in ASC-TS and their safety impact.

---

## 2. Hazard Classification

| Level | Definition | Response |
|-------|------------|----------|
| CATASTROPHIC | Loss of life or system | Immediate shutdown |
| CRITICAL | Severe injury or damage | Safe mode |
| MAJOR | System degradation | Warn and continue |
| MODERATE | Performance impact | Log only |
| MINOR | Negligible impact | Ignore |

---

## 3. Identified Hazards

### 3.1 Hard Constraint Violation

**ID:** HAZ-001  
**Description:** Solver returns a state that violates a hard constraint.  
**Severity:** CATASTROPHIC

**Causes:**

- Numerical precision loss
- Incorrect projection algorithm
- Time budget exceeded before projection

**Effects:**

- Robot collision
- Vehicle crash
- Actuator damage
- Safety envelope breach

**Mitigations:**

1. Runtime hard constraint verification
2. Projection validation before return
3. Safe fallback on deadline

**Detection:** Verification layer post-check

**Residual Risk:** LOW (if mitigations implemented)

---

### 3.2 Deadline Violation

**ID:** HAZ-002  
**Description:** Solver exceeds allocated time budget.  
**Severity:** CRITICAL

**Causes:**

- Unbounded iteration
- Clock check disabled
- Excessive constraint count

**Effects:**

- Real-time control loop missed
- System destabilization
- Loss of responsiveness

**Mitigations:**

1. Hard stop on deadline
2. Clock check every iteration
3. Iteration count limit

**Detection:** Real-time monitor

**Residual Risk:** LOW

---

### 3.3 Non-Deterministic Output

**ID:** HAZ-003  
**Description:** Identical inputs produce different outputs.  
**Severity:** CRITICAL

**Causes:**

- Uninitialized memory
- Floating-point non-associativity
- Race conditions

**Effects:**

- Unreproducible failures
- Certification impossible
- Unpredictable behavior

**Mitigations:**

1. No uninitialized variables
2. Deterministic math operations
3. Single-threaded solver core

**Detection:** Determinism test suite

**Residual Risk:** MODERATE

---

### 3.4 NaN Propagation

**ID:** HAZ-004  
**Description:** NaN or Infinity propagates through solver.  
**Severity:** CATASTROPHIC

**Causes:**

- Division by zero
- Invalid sensor input
- Numerical overflow

**Effects:**

- Silent corruption
- Invalid control commands
- System failure

**Mitigations:**

1. State validation on entry
2. NaN checks in critical paths
3. Safe mode on invalid state

**Detection:** State validation layer

**Residual Risk:** LOW

---

### 3.5 Priority Inversion

**ID:** HAZ-005  
**Description:** Low-priority constraint overrides high-priority one.  
**Severity:** CRITICAL

**Causes:**

- Incorrect weight scaling
- Numerical dominance
- Optimization bug

**Effects:**

- Hard constraint violated
- Safety compromised

**Mitigations:**

1. Hard constraints enforced first
2. Priority-based ordering
3. Verification checks

**Detection:** Constraint verification

**Residual Risk:** LOW

---

### 3.6 Memory Exhaustion

**ID:** HAZ-006  
**Description:** Solver runs out of memory.  
**Severity:** MAJOR

**Causes:**

- Unbounded constraint list
- Memory leak
- Large state vectors

**Effects:**

- Crash
- Undefined behavior

**Mitigations:**

1. Constraint count limit
2. Memory profiling
3. Static allocation where possible

**Detection:** Resource monitoring

**Residual Risk:** MODERATE

---

### 3.7 Silent Degradation

**ID:** HAZ-007  
**Description:** Soft constraints relaxed without logging.  
**Severity:** MODERATE

**Causes:**

- Missing trace call
- Log buffer overflow
- Explainability module disabled

**Effects:**

- Loss of auditability
- Unexplained behavior
- Certification risk

**Mitigations:**

1. Mandatory trace generation
2. Trace validation
3. Explainability tests

**Detection:** Explainability test suite

**Residual Risk:** LOW

---

### 3.8 Constraint Oscillation

**ID:** HAZ-008  
**Description:** Solver oscillates between states.  
**Severity:** MAJOR

**Causes:**

- Conflicting soft constraints
- Numerical instability
- Missing damping

**Effects:**

- Non-convergence
- Deadline violation
- Energy waste

**Mitigations:**

1. Convergence monitoring
2. Damping factors
3. Iteration limits

**Detection:** Convergence tests

**Residual Risk:** MODERATE

---

### 3.9 Infeasibility Not Detected

**ID:** HAZ-009  
**Description:** Solver returns invalid solution instead of reporting infeasibility.  
**Severity:** CATASTROPHIC

**Causes:**

- Missing feasibility check
- Incorrect projection
- Verification bypass

**Effects:**

- Unsafe operation
- System damage

**Mitigations:**

1. Mandatory feasibility check
2. Verification layer enforcement
3. Explicit infeasibility return

**Detection:** Safety test suite

**Residual Risk:** LOW

---

### 3.10 Clock Drift

**ID:** HAZ-010  
**Description:** Time measurement inaccurate.  
**Severity:** MAJOR

**Causes:**

- Low-resolution timer
- OS scheduling
- Clock adjustment

**Effects:**

- Deadline miscalculation
- Timing violations

**Mitigations:**

1. High-resolution timer (nanoseconds)
2. Conservative deadline margins
3. Clock validation

**Detection:** Timing analysis

**Residual Risk:** MODERATE

---

## 4. Hazard Summary Table

| ID | Hazard | Severity | Residual Risk |
|----|--------|----------|---------------|
| HAZ-001 | Hard Constraint Violation | CATASTROPHIC | LOW |
| HAZ-002 | Deadline Violation | CRITICAL | LOW |
| HAZ-003 | Non-Deterministic Output | CRITICAL | MODERATE |
| HAZ-004 | NaN Propagation | CATASTROPHIC | LOW |
| HAZ-005 | Priority Inversion | CRITICAL | LOW |
| HAZ-006 | Memory Exhaustion | MAJOR | MODERATE |
| HAZ-007 | Silent Degradation | MODERATE | LOW |
| HAZ-008 | Constraint Oscillation | MAJOR | MODERATE |
| HAZ-009 | Infeasibility Not Detected | CATASTROPHIC | LOW |
| HAZ-010 | Clock Drift | MAJOR | MODERATE |

---

## 5. Safety Requirements Derived from Hazards

| Requirement | Source Hazard | Priority |
|-------------|---------------|----------|
| REQ-001: Hard constraints always verified | HAZ-001 | CRITICAL |
| REQ-002: Deadline always enforced | HAZ-002 | CRITICAL |
| REQ-003: Determinism always maintained | HAZ-003 | CRITICAL |
| REQ-004: NaN detection mandatory | HAZ-004 | CRITICAL |
| REQ-005: Priority ordering enforced | HAZ-005 | CRITICAL |
| REQ-006: Memory limits enforced | HAZ-006 | MAJOR |
| REQ-007: Trace always generated | HAZ-007 | MODERATE |
| REQ-008: Convergence monitored | HAZ-008 | MAJOR |
| REQ-009: Infeasibility explicitly reported | HAZ-009 | CRITICAL |
| REQ-010: High-resolution timing | HAZ-010 | MAJOR |

---

**Hazard analysis approved by:**

- [ ] Safety Engineer
- [ ] Verification AI
- [ ] Certification AI

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1.0 | 2026-01-06 | Initial | First draft |
