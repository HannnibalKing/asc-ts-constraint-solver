/**
 * Concrete Constraint Implementations
 * 
 * Reference implementations based on CONSTRAINT-TEMPLATES.md
 */

import { Constraint, State, ConstraintResult, ConstraintKind } from '../core/types';

/**
 * Position Bounds Constraint (HARD)
 * 
 * Enforces: x_min ≤ x ≤ x_max for all dimensions
 */
export class PositionBounds implements Constraint {
  id: string;
  kind: ConstraintKind = 'HARD';
  priority: number = 0;

  constructor(
    private xMin: number[],
    private xMax: number[],
    id?: string
  ) {
    this.id = id || 'PositionBounds';
  }

  evaluate(state: State): ConstraintResult {
    let violation = 0;
    const gradient: number[] = new Array<number>(state.position.length).fill(0);

    for (let i = 0; i < state.position.length; i++) {
      const x = state.position[i];

      if (x > this.xMax[i]) {
        violation += x - this.xMax[i];
        gradient[i] = 1;
      } else if (x < this.xMin[i]) {
        violation += this.xMin[i] - x;
        gradient[i] = -1;
      }
    }

    return {
      satisfied: violation === 0,
      violation,
      gradient,
    };
  }

  project(state: State): State {
    const projected = { ...state };
    projected.position = state.position.map((x, i) =>
      Math.max(this.xMin[i], Math.min(this.xMax[i], x))
    );
    return projected;
  }
}

/**
 * Velocity Limit Constraint (HARD)
 * 
 * Enforces: ‖v‖₂ ≤ v_max
 */
export class VelocityLimit implements Constraint {
  id: string;
  kind: ConstraintKind = 'HARD';
  priority: number = 0;

  constructor(
    private vMax: number,
    id?: string
  ) {
    this.id = id || 'VelocityLimit';
  }

  evaluate(state: State): ConstraintResult {
    const vNorm = Math.sqrt(
      state.velocity.reduce((sum, v) => sum + v * v, 0)
    );

    const violation = Math.max(0, vNorm - this.vMax);

    const gradient = vNorm === 0
      ? state.velocity.map(() => 0)
      : state.velocity.map(v => v / vNorm);

    return {
      satisfied: violation === 0,
      violation,
      gradient,
    };
  }

  project(state: State): State {
    const vNorm = Math.sqrt(
      state.velocity.reduce((sum, v) => sum + v * v, 0)
    );

    if (vNorm <= this.vMax) return state;

    const scale = this.vMax / vNorm;
    return {
      ...state,
      velocity: state.velocity.map(v => v * scale),
    };
  }
}

/**
 * Comfort Acceleration Constraint (SOFT)
 * 
 * Penalty: w * max(0, ‖a‖₂ - a_pref)²
 */
export class ComfortAcceleration implements Constraint {
  id: string;
  kind: ConstraintKind = 'SOFT';

  constructor(
    private aPref: number,
    private weight: number,
    public priority: number,
    id?: string
  ) {
    this.id = id || 'ComfortAcceleration';
  }

  evaluate(state: State): ConstraintResult {
    const aNorm = Math.sqrt(
      state.acceleration.reduce((sum, a) => sum + a * a, 0)
    );

    const excess = Math.max(0, aNorm - this.aPref);
    const penalty = this.weight * excess * excess;

    const gradient = (aNorm <= this.aPref || aNorm === 0)
      ? state.acceleration.map(() => 0)
      : state.acceleration.map(a => 2 * this.weight * excess * a / aNorm);

    return {
      satisfied: aNorm <= this.aPref,
      violation: penalty,
      gradient,
    };
  }
}

/**
 * Obstacle Avoidance Constraint (HARD)
 * 
 * Enforces: ‖x - x_obstacle‖₂ ≥ r_safe
 */
export class ObstacleAvoidance implements Constraint {
  id: string;
  kind: ConstraintKind = 'HARD';
  priority: number = 0;

  constructor(
    private obstaclePos: number[],
    private safeRadius: number,
    id?: string
  ) {
    this.id = id || 'ObstacleAvoidance';
  }

  evaluate(state: State): ConstraintResult {
    const distance = Math.sqrt(
      state.position.reduce((sum, x, i) => {
        const diff = x - this.obstaclePos[i];
        return sum + diff * diff;
      }, 0)
    );

    const violation = Math.max(0, this.safeRadius - distance);

    const gradient = distance === 0
      ? state.position.map(() => 1) // Arbitrary repulsion
      : state.position.map((x, i) => (x - this.obstaclePos[i]) / distance);

    return {
      satisfied: distance >= this.safeRadius,
      violation,
      gradient,
    };
  }

  project(state: State): State {
    const offset = state.position.map((x, i) => x - this.obstaclePos[i]);
    const distance = Math.sqrt(offset.reduce((sum, value) => sum + value * value, 0));

    if (distance >= this.safeRadius) return state;

    const direction = distance === 0
      ? state.position.map((_, index) => index === 0 ? 1 : 0)
      : offset.map(value => value / distance);

    return {
      ...state,
      position: this.obstaclePos.map((value, i) => value + direction[i] * this.safeRadius),
    };
  }
}

/**
 * Goal Reaching Constraint (OBJECTIVE)
 * 
 * Minimize: ‖x - x_goal‖₂²
 */
export class GoalReaching implements Constraint {
  id: string;
  kind: ConstraintKind = 'OBJECTIVE';
  priority: number = 1000; // Low priority

  constructor(
    private goalPos: number[],
    private weight: number,
    id?: string
  ) {
    this.id = id || 'GoalReaching';
  }

  evaluate(state: State): ConstraintResult {
    const distanceSquared = state.position.reduce((sum, x, i) => {
      const diff = x - this.goalPos[i];
      return sum + diff * diff;
    }, 0);

    const cost = this.weight * distanceSquared;

    const gradient = state.position.map((x, i) =>
      2 * this.weight * (x - this.goalPos[i])
    );

    return {
      satisfied: false, // Always unsatisfied (optimization goal)
      violation: cost,
      gradient,
    };
  }
}
