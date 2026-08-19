import { createSafeState, validateState } from './state';

describe('state validation', () => {
  it('creates a valid zeroed state with the requested dimensions', () => {
    const state = createSafeState(2);

    expect(validateState(state)).toEqual({
      valid: true,
      errors: [],
      warnings: [],
    });
    expect(state.position).toEqual([0, 0]);
    expect(state.velocity).toEqual([0, 0]);
  });

  it('rejects non-finite values and inconsistent dimensions', () => {
    const validation = validateState({
      position: [Number.NaN],
      velocity: [0, 0],
      acceleration: [0],
      timestamp: -1,
    });

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(expect.arrayContaining([
      'Position contains non-finite values (NaN or Infinity)',
      'Timestamp cannot be negative',
      'Velocity dimension (2) does not match position (1)',
    ]));
  });
});