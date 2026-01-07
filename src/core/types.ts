/**
 * Core Type Definitions for ASC-TS
 * 
 * Autonomous Systems Constraint Solver
 * Safety-critical type definitions
 */

/**
 * Constraint classification
 */
export type ConstraintKind = 'HARD' | 'SOFT' | 'OBJECTIVE';

/**
 * Vector type for multi-dimensional state
 */
export type Vector = number[];

/**
 * System state representation
 * 
 * INVARIANTS:
 * - All numeric values must be finite (no NaN, no Infinity)
 * - Arrays must have consistent dimensions
 * - Timestamp must be monotonically increasing
 */
export interface State {
  /** Position in n-dimensional space */
  position: Vector;
  
  /** Velocity vector */
  velocity: Vector;
  
  /** Acceleration vector */
  acceleration: Vector;
  
  /** Current timestamp (microseconds) */
  timestamp: number;
  
  /** Optional: Joint angles for robotic systems */
  jointAngles?: Vector;
  
  /** Optional: Actuator states (0 = off, 1 = on) */
  actuators?: Record<string, boolean>;
  
  /** Optional: Custom state fields */
  [key: string]: unknown;
}

/**
 * Result of constraint evaluation
 */
export interface ConstraintResult {
  /** Whether constraint is satisfied */
  satisfied: boolean;
  
  /** 
   * Violation magnitude
   * - 0 if satisfied
   * - >0 for HARD/SOFT violations (absolute)
   * - Cost for OBJECTIVE (to minimize)
   */
  violation: number;
  
  /** Optional gradient for optimization */
  gradient?: Vector;
  
  /** Optional Hessian for second-order methods */
  hessian?: number[][];
}

/**
 * Base constraint interface
 * 
 * All constraints must implement this interface.
 */
export interface Constraint {
  /** Unique constraint identifier */
  id: string;
  
  /** Constraint type */
  kind: ConstraintKind;
  
  /** 
   * Priority level
   * - Lower number = higher priority
   * - HARD constraints typically have priority 0-99
   * - SOFT constraints typically have priority 100-999
   * - OBJECTIVE typically has priority 1000+
   */
  priority: number;
  
  /**
   * Evaluate constraint on given state
   * 
   * MUST be deterministic: same state → same result
   * MUST NOT modify state
   */
  evaluate(state: State): ConstraintResult;
  
  /** Optional: Project state to satisfy this constraint */
  project?(state: State): State;
}

/**
 * Solver configuration
 */
export interface SolverConfig {
  /** Maximum number of iterations */
  maxIterations: number;
  
  /** Time budget */
  deadline: DeadlineConfig;
  
  /** Numerical tolerance for convergence */
  tolerance?: number;
  
  /** Damping factor for optimization */
  dampingFactor?: number;
  
  /** Enable verbose logging */
  verbose?: boolean;
}

/**
 * Deadline configuration
 */
export interface DeadlineConfig {
  /** Maximum time in microseconds */
  maxMicros: number;
  
  /** 
   * Hard stop enforcement
   * - true: Terminate immediately at deadline
   * - false: Complete current iteration
   */
  hardStop: boolean;
}

/**
 * Decision trace for explainability
 */
export interface DecisionTrace {
  /** IDs of constraints that were violated */
  violatedConstraints: string[];
  
  /** IDs of soft constraints that were relaxed */
  relaxedConstraints: string[];
  
  /** IDs of constraints actively enforced */
  activeConstraints: string[];
  
  /** Why solver terminated */
  terminationReason: TerminationReason;
  
  /** Number of iterations executed */
  iterationCount: number;
  
  /** Time budget used (microseconds) */
  timeBudgetUsed: number;
  
  /** Optional: Detailed iteration history */
  iterationHistory?: IterationRecord[];
}

/**
 * Reasons for solver termination
 */
export type TerminationReason =
  | 'converged'           // Solution converged within tolerance
  | 'maxIterations'       // Hit iteration limit
  | 'deadlineExceeded'    // Time budget expired
  | 'infeasible'          // No feasible solution exists
  | 'invalidState'        // Input state contains NaN/Infinity
  | 'error';              // Unexpected error occurred

/**
 * Record of a single solver iteration
 */
export interface IterationRecord {
  /** Iteration number */
  iteration: number;
  
  /** State at this iteration */
  state: State;
  
  /** Total violation at this iteration */
  totalViolation: number;
  
  /** Time elapsed (microseconds) */
  timeElapsed: number;
}

/**
 * Solver result
 */
export interface SolverResult {
  /** Resulting state (safe or best-effort) */
  state: State;
  
  /** Whether a feasible solution was found */
  feasible: boolean;
  
  /** Whether solution satisfies all hard constraints */
  safe: boolean;
  
  /** Decision trace for explainability */
  trace: DecisionTrace;
  
  /** Total cost (objective value) */
  cost?: number;
}

/**
 * Infeasibility proof
 */
export interface InfeasibilityProof {
  /** IDs of conflicting constraints */
  conflictingConstraints: string[];
  
  /** Whether this is a minimal infeasible set */
  minimalSet: boolean;
  
  /** Human-readable explanation */
  explanation: string;
  
  /** Violation magnitudes for each constraint */
  violationMagnitudes: Record<string, number>;
}

/**
 * Validation result for state
 */
export interface StateValidation {
  /** Whether state is valid */
  valid: boolean;
  
  /** Error messages if invalid */
  errors: string[];
  
  /** Warning messages */
  warnings: string[];
}

/**
 * Constraint group for organizing constraints
 */
export interface ConstraintGroup {
  /** Group name */
  name: string;
  
  /** Constraints in this group */
  constraints: Constraint[];
  
  /** Group priority (if different from individual) */
  priority?: number;
}

/**
 * Change manifest for version control
 */
export interface ChangeManifest {
  /** IDs of constraints affected by this change */
  affectedConstraints: string[];
  
  /** Impact on determinism */
  determinismImpact: 'NONE' | 'LOW' | 'HIGH';
  
  /** Impact on safety */
  safetyImpact: 'NONE' | 'SOFT' | 'HARD';
  
  /** Whether verification tests were updated */
  verificationUpdated: boolean;
  
  /** Test IDs that cover this change */
  testsCovered: string[];
}
