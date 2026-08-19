/**
 * Decision Trace Engine
 * 
 * Generates human-auditable explanations of solver decisions
 */

import { DecisionTrace, Constraint, TerminationReason } from '../core/types';

/**
 * Trace builder for constructing decision traces
 */
export class TraceBuilder {
  private violatedConstraints: Set<string> = new Set();
  private relaxedConstraints: Set<string> = new Set();
  private activeConstraints: Set<string> = new Set();
  private iterationCount: number = 0;
  private startTime: number = performance.now();

  /**
   * Record a constraint violation
   */
  recordViolation(constraintId: string): void {
    this.violatedConstraints.add(constraintId);
  }

  /**
   * Record a constraint relaxation
   */
  recordRelaxation(constraintId: string): void {
    this.relaxedConstraints.add(constraintId);
  }

  /**
   * Record an active constraint
   */
  recordActive(constraintId: string): void {
    this.activeConstraints.add(constraintId);
  }

  /**
   * Increment iteration counter
   */
  incrementIteration(): void {
    this.iterationCount++;
  }

  /**
   * Build final trace
   */
  build(terminationReason: string): DecisionTrace {
    const timeBudgetUsed = (performance.now() - this.startTime) * 1000; // microseconds

    return {
      violatedConstraints: Array.from(this.violatedConstraints),
      relaxedConstraints: Array.from(this.relaxedConstraints),
      activeConstraints: Array.from(this.activeConstraints),
      terminationReason: terminationReason as TerminationReason,
      iterationCount: this.iterationCount,
      timeBudgetUsed,
    };
  }
}

/**
 * Format trace as human-readable text
 */
export function formatTrace(trace: DecisionTrace): string {
  const lines: string[] = [];

  lines.push('=== Decision Trace ===');
  lines.push('');
  lines.push(`Termination: ${trace.terminationReason}`);
  lines.push(`Iterations: ${trace.iterationCount}`);
  lines.push(`Time Used: ${trace.timeBudgetUsed.toFixed(2)} µs`);
  lines.push('');

  if (trace.violatedConstraints.length > 0) {
    lines.push('Violated Constraints:');
    trace.violatedConstraints.forEach(id => lines.push(`  - ${id}`));
    lines.push('');
  }

  if (trace.relaxedConstraints.length > 0) {
    lines.push('Relaxed Constraints:');
    trace.relaxedConstraints.forEach(id => lines.push(`  - ${id}`));
    lines.push('');
  }

  if (trace.activeConstraints.length > 0) {
    lines.push('Active Constraints:');
    trace.activeConstraints.forEach(id => lines.push(`  - ${id}`));
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Export trace as JSON
 */
export function exportTrace(trace: DecisionTrace): string {
  return JSON.stringify(trace, null, 2);
}

/**
 * Generate human explanation for termination reason
 */
export function explainTermination(reason: string): string {
  const explanations: Record<string, string> = {
    converged: 'The solver found a solution that satisfies all constraints within tolerance.',
    maxIterations: 'The solver reached the maximum iteration limit before fully converging.',
    deadlineExceeded: 'The solver ran out of time and returned the best solution found so far.',
    infeasible: 'No solution exists that satisfies all hard constraints.',
    invalidState: 'The input state contained invalid values (NaN or Infinity).',
    error: 'An unexpected error occurred during solving.',
  };

  return explanations[reason] || 'Unknown termination reason.';
}

/**
 * Explain why constraints were relaxed
 */
export function explainRelaxation(
  relaxedConstraints: string[],
  constraints: Constraint[]
): string {
  if (relaxedConstraints.length === 0) {
    return 'No constraints were relaxed.';
  }

  const lines: string[] = [];
  lines.push('Constraints were relaxed to satisfy higher-priority hard constraints:');
  lines.push('');

  const constraintMap = new Map(constraints.map(c => [c.id, c]));

  for (const id of relaxedConstraints) {
    const constraint = constraintMap.get(id);
    if (constraint) {
      lines.push(`  - ${id} (${constraint.kind}, priority ${constraint.priority})`);
    } else {
      lines.push(`  - ${id} (unknown)`);
    }
  }

  return lines.join('\n');
}
