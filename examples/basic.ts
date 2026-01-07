/**
 * Basic Usage Example for ASC-TS
 * 
 * Demonstrates simple constraint solving
 */

import {
  ConstraintSolver,
  State,
  PositionBounds,
  VelocityLimit,
  GoalReaching,
} from '../src';

function main(): void {
  console.log('=== ASC-TS Basic Example ===\n');

  // Create solver with configuration
  const solver = new ConstraintSolver({
    maxIterations: 100,
    deadline: { maxMicros: 1000, hardStop: true },
    tolerance: 1e-6,
  });

  // Add hard constraints
  solver.addConstraint(
    new PositionBounds(
      [0, 0, 0],    // min bounds
      [10, 10, 10], // max bounds
      'workspace_bounds'
    )
  );

  solver.addConstraint(
    new VelocityLimit(5.0, 'max_velocity')
  );

  // Add optimization goal
  solver.addConstraint(
    new GoalReaching(
      [8, 8, 8], // goal position
      1.0,       // weight
      'reach_goal'
    )
  );

  // Initial state
  const initialState: State = {
    position: [1, 1, 1],
    velocity: [0, 0, 0],
    acceleration: [0, 0, 0],
    timestamp: 0,
  };

  console.log('Initial state:', initialState.position);
  console.log('Solving...\n');

  // Solve
  const result = solver.solve(initialState);

  // Display results
  console.log('=== Results ===');
  console.log('Feasible:', result.feasible);
  console.log('Safe:', result.safe);
  console.log('Final position:', result.state.position);
  console.log('\n=== Trace ===');
  console.log('Termination reason:', result.trace.terminationReason);
  console.log('Iterations:', result.trace.iterationCount);
  console.log('Time used:', result.trace.timeBudgetUsed.toFixed(2), 'µs');
  console.log('Active constraints:', result.trace.activeConstraints);
  console.log('Violated constraints:', result.trace.violatedConstraints);
}

main();
