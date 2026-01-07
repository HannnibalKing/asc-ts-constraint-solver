/**
 * Constraint Solver Engine
 * 
 * Core solver orchestration for ASC-TS
 * 
 * SAFETY-CRITICAL MODULE
 */

import {
  State,
  Constraint,
  SolverConfig,
  SolverResult,
  DecisionTrace,
  TerminationReason,
} from './types';
import { validateState, cloneState } from './state';

/**
 * Constraint Solver
 * 
 * Enforces hard constraints and optimizes soft constraints
 * under real-time deadlines.
 */
export class ConstraintSolver {
  private constraints: Constraint[] = [];
  private config: SolverConfig;
  private startTime: number = 0;

  constructor(config: SolverConfig) {
    this.config = {
      tolerance: 1e-6,
      dampingFactor: 0.5,
      verbose: false,
      ...config,
    };
  }

  /**
   * Add a constraint to the solver
   */
  addConstraint(constraint: Constraint): void {
    this.constraints.push(constraint);
    // Sort by priority (lower = higher priority)
    this.constraints.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Remove a constraint by ID
   */
  removeConstraint(id: string): void {
    this.constraints = this.constraints.filter((c) => c.id !== id);
  }

  /**
   * Solve constraints for given state
   * 
   * CRITICAL: This method must NEVER violate hard constraints
   * 
   * @param initialState Starting state
   * @returns Solver result with trace
   */
  solve(initialState: State): SolverResult {
    this.startTime = performance.now();

    // CRITICAL: Validate input state
    const validation = validateState(initialState);
    if (!validation.valid) {
      return this.createInfeasibleResult(
        initialState,
        'invalidState',
        validation.errors
      );
    }

    let state = cloneState(initialState);
    const trace: Partial<DecisionTrace> = {
      violatedConstraints: [],
      relaxedConstraints: [],
      activeConstraints: [],
      iterationCount: 0,
      timeBudgetUsed: 0,
    };

    // Main solver loop
    for (let iteration = 0; iteration < this.config.maxIterations; iteration++) {
      trace.iterationCount = iteration + 1;

      // Check deadline
      if (this.isDeadlineExceeded()) {
        return this.createResult(state, 'deadlineExceeded', trace as DecisionTrace);
      }

      // Evaluate all constraints
      const violations = this.evaluateConstraints(state);

      // Check if all hard constraints are satisfied
      if (this.areHardConstraintsSatisfied(violations)) {
        // Optimize soft constraints
        state = this.optimizeSoftConstraints(state, violations);

        // Check convergence
        if (this.hasConverged(violations)) {
          return this.createResult(state, 'converged', trace as DecisionTrace);
        }
      } else {
        // Enforce hard constraints
        state = this.enforceHardConstraints(state, violations);
      }
    }

    // Hit iteration limit
    return this.createResult(state, 'maxIterations', trace as DecisionTrace);
  }

  /**
   * Evaluate all constraints
   */
  private evaluateConstraints(state: State): Map<string, { constraint: Constraint; result: any }> {
    const violations = new Map();

    for (const constraint of this.constraints) {
      const result = constraint.evaluate(state);
      violations.set(constraint.id, { constraint, result });
    }

    return violations;
  }

  /**
   * Check if all hard constraints are satisfied
   */
  private areHardConstraintsSatisfied(violations: Map<string, any>): boolean {
    for (const [, { constraint, result }] of violations) {
      if (constraint.kind === 'HARD' && !result.satisfied) {
        return false;
      }
    }
    return true;
  }

  /**
   * Enforce hard constraints via projection
   * 
   * STUB: To be implemented by Solver AI
   */
  private enforceHardConstraints(state: State, violations: Map<string, any>): State {
    // TODO: Implement hard constraint projection
    // For now, return unchanged state
    return state;
  }

  /**
   * Optimize soft constraints
   * 
   * STUB: To be implemented by Solver AI
   */
  private optimizeSoftConstraints(state: State, violations: Map<string, any>): State {
    // TODO: Implement soft constraint optimization
    // For now, return unchanged state
    return state;
  }

  /**
   * Check if solver has converged
   */
  private hasConverged(violations: Map<string, any>): boolean {
    const tolerance = this.config.tolerance!;
    let totalViolation = 0;

    for (const [, { result }] of violations) {
      totalViolation += result.violation;
    }

    return totalViolation < tolerance;
  }

  /**
   * Check if deadline has been exceeded
   */
  private isDeadlineExceeded(): boolean {
    const elapsed = (performance.now() - this.startTime) * 1000; // Convert to microseconds
    return elapsed >= this.config.deadline.maxMicros;
  }

  /**
   * Get elapsed time in microseconds
   */
  private getElapsedMicros(): number {
    return (performance.now() - this.startTime) * 1000;
  }

  /**
   * Create a solver result
   */
  private createResult(
    state: State,
    reason: TerminationReason,
    trace: DecisionTrace
  ): SolverResult {
    const finalTrace: DecisionTrace = {
      ...trace,
      terminationReason: reason,
      timeBudgetUsed: this.getElapsedMicros(),
    };

    // Verify hard constraints one last time
    const violations = this.evaluateConstraints(state);
    const safe = this.areHardConstraintsSatisfied(violations);

    return {
      state,
      feasible: safe,
      safe,
      trace: finalTrace,
    };
  }

  /**
   * Create an infeasible result
   */
  private createInfeasibleResult(
    state: State,
    reason: TerminationReason,
    errors: string[]
  ): SolverResult {
    return {
      state,
      feasible: false,
      safe: false,
      trace: {
        violatedConstraints: errors,
        relaxedConstraints: [],
        activeConstraints: [],
        terminationReason: reason,
        iterationCount: 0,
        timeBudgetUsed: this.getElapsedMicros(),
      },
    };
  }
}
