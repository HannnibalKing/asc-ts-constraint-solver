import { exportTrace, formatTrace } from './trace';

const trace = {
  violatedConstraints: ['position'],
  relaxedConstraints: [],
  activeConstraints: ['velocity'],
  terminationReason: 'converged' as const,
  iterationCount: 2,
  timeBudgetUsed: 12.5,
};

describe('decision trace formatting', () => {
  it('includes the termination and constraint sections', () => {
    const formatted = formatTrace(trace);

    expect(formatted).toContain('Termination: converged');
    expect(formatted).toContain('Violated Constraints:');
    expect(formatted).toContain('  - position');
    expect(formatted).toContain('Active Constraints:');
  });

  it('exports valid JSON', () => {
    expect(JSON.parse(exportTrace(trace))).toEqual(trace);
  });
});