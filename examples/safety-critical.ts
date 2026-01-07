/**
 * Safety-Critical Example
 * 
 * Demonstrates hard constraint enforcement and infeasibility detection
 */

import {
  ConstraintSolver,
  State,
  PositionBounds,
  VelocityLimit,
  formatTrace,
} from '../src';

function conflictingConstraintsExample(): void {
  console.log('=== Scenario: Conflicting Hard Constraints ===\n');

  const solver = new ConstraintSolver({
    maxIterations: 100,
    deadline: { maxMicros: 500, hardStop: true },
  });

  // Add conflicting position bounds
  solver.addConstraint(
    new PositionBounds([0, 0], [5, 5], 'bounds_1')
  );

  solver.addConstraint(
    new PositionBounds([10, 10], [15, 15], 'bounds_2')
  );

  const initialState: State = {
    position: [7, 7],
    velocity: [0, 0],
    acceleration: [0, 0],
    timestamp: 0,
  };

  const result = solver.solve(initialState);

  console.log('Result:');
  console.log('  Feasible:', result.feasible);
  console.log('  Safe:', result.safe);
  console.log('\nTrace:\n');
  console.log(formatTrace(result.trace));
}

function nanInjectionExample(): void {
  console.log('\n=== Scenario: NaN Injection (State Corruption) ===\n');

  const solver = new ConstraintSolver({
    maxIterations: 100,
    deadline: { maxMicros: 500, hardStop: true },
  });

  solver.addConstraint(
    new VelocityLimit(10.0, 'max_velocity')
  );

  // Corrupted state with NaN
  const corruptedState: State = {
    position: [NaN, 5],
    velocity: [1, 1],
    acceleration: [0, 0],
    timestamp: 0,
  };

  console.log('Attempting to solve with NaN in state...\n');

  const result = solver.solve(corruptedState);

  console.log('Result:');
  console.log('  Feasible:', result.feasible);
  console.log('  Safe:', result.safe);
  console.log('  Termination:', result.trace.terminationReason);
  console.log('\nViolated constraints:', result.trace.violatedConstraints);
}

function timeoutExample(): void {
  console.log('\n=== Scenario: Deadline Exceeded ===\n');

  const solver = new ConstraintSolver({
    maxIterations: 10000, // Very high
    deadline: { maxMicros: 10, hardStop: true }, // Very tight
  });

  // Add many constraints
  for (let i = 0; i < 100; i++) {
    solver.addConstraint(
      new PositionBounds([0], [100], `constraint_${i}`)
    );
  }

  const initialState: State = {
    position: [50],
    velocity: [0],
    acceleration: [0],
    timestamp: 0,
  };

  console.log('Running with 100 constraints and 10µs deadline...\n');

  const result = solver.solve(initialState);

  console.log('Result:');
  console.log('  Termination:', result.trace.terminationReason);
  console.log('  Iterations:', result.trace.iterationCount);
  console.log('  Time used:', result.trace.timeBudgetUsed.toFixed(2), 'µs');
  console.log('  Safe:', result.safe);
}

// Run all examples
conflictingConstraintsExample();
nanInjectionExample();
timeoutExample();
