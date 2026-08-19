/**
 * State Validation Utilities
 * 
 * Runtime validation of system state for safety
 */

import { State, StateValidation } from './types';

/**
 * Validate state for safety-critical operations
 * 
 * CRITICAL: This function must be called before every solver iteration
 * 
 * @param state State to validate
 * @returns Validation result
 */
export function validateState(state: State): StateValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check position
  if (!isFiniteVector(state.position)) {
    errors.push('Position contains non-finite values (NaN or Infinity)');
  }

  // Check velocity
  if (!isFiniteVector(state.velocity)) {
    errors.push('Velocity contains non-finite values (NaN or Infinity)');
  }

  // Check acceleration
  if (!isFiniteVector(state.acceleration)) {
    errors.push('Acceleration contains non-finite values (NaN or Infinity)');
  }

  // Check timestamp
  if (!Number.isFinite(state.timestamp)) {
    errors.push('Timestamp is not finite');
  }

  if (state.timestamp < 0) {
    errors.push('Timestamp cannot be negative');
  }

  // Check dimension consistency
  const dim = state.position.length;
  if (state.velocity.length !== dim) {
    errors.push(
      `Velocity dimension (${state.velocity.length}) does not match position (${dim})`
    );
  }

  if (state.acceleration.length !== dim) {
    errors.push(
      `Acceleration dimension (${state.acceleration.length}) does not match position (${dim})`
    );
  }

  // Check optional fields
  if (state.jointAngles && !isFiniteVector(state.jointAngles)) {
    errors.push('Joint angles contain non-finite values');
  }

  // Warnings for edge cases
  if (state.position.length === 0) {
    warnings.push('State has zero dimensions');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Check if all elements of a vector are finite
 */
function isFiniteVector(vec: number[]): boolean {
  return vec.every((v) => Number.isFinite(v));
}

/**
 * Assert that state is valid (throws on failure)
 * 
 * Use this in critical safety paths
 * 
 * @param state State to validate
 * @throws Error if state is invalid
 */
export function assertValidState(state: State): void {
  const validation = validateState(state);

  if (!validation.valid) {
    throw new Error(
      `Invalid state: ${validation.errors.join(', ')}`
    );
  }
}

/**
 * Create a safe default state
 * 
 * Use this as a fallback when no valid state is available
 */
export function createSafeState(dimensions: number): State {
  return {
    position: new Array<number>(dimensions).fill(0),
    velocity: new Array<number>(dimensions).fill(0),
    acceleration: new Array<number>(dimensions).fill(0),
    timestamp: 0,
  };
}

/**
 * Clone a state (deep copy)
 */
export function cloneState(state: State): State {
  return {
    position: [...state.position],
    velocity: [...state.velocity],
    acceleration: [...state.acceleration],
    timestamp: state.timestamp,
    jointAngles: state.jointAngles ? [...state.jointAngles] : undefined,
    actuators: state.actuators ? { ...state.actuators } : undefined,
  };
}
