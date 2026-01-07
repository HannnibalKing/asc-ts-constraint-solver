/**
 * Runtime Invariant Verification
 * 
 * Safety checks enforced at runtime
 * 
 * CRITICAL: These checks must NEVER be disabled
 */

import { State, Constraint, SolverResult } from '../core/types';
import { validateState } from '../core/state';

/**
 * Violation report for safety failures
 */
export interface ViolationReport {
  constraintId: string;
  stateSnapshot: State;
  violationMagnitude: number;
  timeBudgetStatus: 'OK' | 'EXCEEDED';
  stackTrace: string;
  timestamp: number;
}

/**
 * Runtime assertion error
 */
export class InvariantViolationError extends Error {
  constructor(
    message: string,
    public report: ViolationReport
  ) {
    super(message);
    this.name = 'InvariantViolationError';
  }
}

/**
 * Verify hard constraints are satisfied
 * 
 * CRITICAL: Throws if any hard constraint is violated
 */
export function verifyHardConstraints(
  state: State,
  constraints: Constraint[]
): void {
  for (const constraint of constraints) {
    if (constraint.kind !== 'HARD') continue;

    const result = constraint.evaluate(state);

    if (!result.satisfied) {
      const report: ViolationReport = {
        constraintId: constraint.id,
        stateSnapshot: state,
        violationMagnitude: result.violation,
        timeBudgetStatus: 'OK',
        stackTrace: new Error().stack || '',
        timestamp: Date.now(),
      };

      throw new InvariantViolationError(
        `HARD constraint violated: ${constraint.id} (violation: ${result.violation})`,
        report
      );
    }
  }
}

/**
 * Verify state validity
 * 
 * CRITICAL: Throws if state contains NaN or Infinity
 */
export function verifyStateValidity(state: State): void {
  const validation = validateState(state);

  if (!validation.valid) {
    throw new Error(
      `Invalid state: ${validation.errors.join(', ')}`
    );
  }
}

/**
 * Verify solver result is safe
 * 
 * CRITICAL: Throws if result claims to be safe but violates hard constraints
 */
export function verifySolverResult(
  result: SolverResult,
  constraints: Constraint[]
): void {
  // Verify state validity
  verifyStateValidity(result.state);

  // If result claims to be safe, verify it
  if (result.safe) {
    try {
      verifyHardConstraints(result.state, constraints);
    } catch (error) {
      throw new Error(
        `Solver result claims to be safe but violates hard constraints: ${error}`
      );
    }
  }

  // Verify trace is complete
  if (!result.trace) {
    throw new Error('Solver result missing decision trace');
  }

  if (!result.trace.terminationReason) {
    throw new Error('Decision trace missing termination reason');
  }
}

/**
 * Verify determinism
 * 
 * Run solver twice with same inputs and verify identical outputs
 */
export function verifyDeterminism(
  solver: any,
  state: State,
  constraints: Constraint[]
): boolean {
  const result1 = solver.solve(state);
  const result2 = solver.solve(state);

  return JSON.stringify(result1.state) === JSON.stringify(result2.state);
}

/**
 * Assertion helper
 */
export function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}
