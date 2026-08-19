import { PositionBounds, VelocityLimit } from './basic';
import { createSafeState } from '../core/state';

describe('built-in hard constraints', () => {
  it('projects positions into configured bounds', () => {
    const state = createSafeState(2);
    state.position = [-2, 5];
    const constraint = new PositionBounds([0, 0], [1, 3]);

    expect(constraint.evaluate(state).satisfied).toBe(false);
    expect(constraint.project(state).position).toEqual([0, 3]);
  });

  it('projects velocity onto the configured magnitude limit', () => {
    const state = createSafeState(2);
    state.velocity = [3, 4];
    const constraint = new VelocityLimit(2);

    expect(constraint.evaluate(state).violation).toBe(3);
    expect(constraint.project(state).velocity[0]).toBeCloseTo(1.2);
    expect(constraint.project(state).velocity[1]).toBeCloseTo(1.6);
  });
});