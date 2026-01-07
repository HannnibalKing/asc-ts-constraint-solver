/**
 * Public API for ASC-TS
 * 
 * Autonomous Systems Constraint Solver
 */

// Core types
export * from './core/types';
export * from './core/state';
export * from './core/engine';

// Constraints
export * from './constraints/basic';

// Verification
export * from './verify/invariants';

// Explainability
export * from './explain/trace';

// Re-export commonly used classes
export { ConstraintSolver } from './core/engine';
export {
  PositionBounds,
  VelocityLimit,
  ComfortAcceleration,
  ObstacleAvoidance,
  GoalReaching,
} from './constraints/basic';
