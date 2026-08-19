import { ConstraintSolver } from './engine';
import { createSafeState } from './state';
import { ObstacleAvoidance, PositionBounds, VelocityLimit } from '../constraints/basic';

function createSolver(): ConstraintSolver {
  return new ConstraintSolver({
    maxIterations: 5,
    deadline: { maxMicros: 100_000, hardStop: true },
  });
}

describe('ConstraintSolver hard constraints', () => {
  it('projects all built-in hard constraints before returning a safe result', () => {
    const solver = createSolver();
    solver.addConstraint(new PositionBounds([0, 0], [10, 10]));
    solver.addConstraint(new VelocityLimit(2));
    solver.addConstraint(new ObstacleAvoidance([5, 5], 1));

    const state = createSafeState(2);
    state.position = [5, 5];
    state.velocity = [3, 4];

    const result = solver.solve(state);

    expect(result.safe).toBe(true);
    expect(result.feasible).toBe(true);
    expect(result.state.position).toEqual([6, 5]);
    expect(Math.hypot(...result.state.velocity)).toBeCloseTo(2);
  });

  it('rejects invalid input without attempting projection', () => {
    const solver = createSolver();
    solver.addConstraint(new PositionBounds([0], [1]));
    const state = createSafeState(1);
    state.position = [Number.NaN];

    const result = solver.solve(state);

    expect(result.safe).toBe(false);
    expect(result.trace.terminationReason).toBe('invalidState');
  });
});