/**
 * Chapter 1 Level 7 - The Drain
 * Introduces the first-order system (leaky tank) — 1/(s+1).
 * The tank now has a drain: outflow proportional to level, so it settles
 * to a finite steady-state instead of ramping forever.
 * Goal: Steady-state level >= 1.0. Plant DC gain = 1, so need k >= 1.
 */

// ============================================
// 1. REGISTER LEVEL CONFIGURATION
// ============================================
LevelConfig.register('ch1l7', {
    id: 'ch1l7',
    chapter: 1,
    level: 7,
    title: 'The Drain',
    simulationMode: 'dynamic',
    T: 10,
    dt: 0.1,
    toolboxBlocks: [{ type: 'gain', data: { label: 'Valve', min: 0, max: 2, step: 0.1, value: 1 } }],
    defaultBlocks: [
        { type: 'constant', x: 100, y: 200, data: { label: 'Pump', value: 1.0, readonly: true } },
        { type: 'transfer_function', x: 450, y: 200, data: { label: 'Leaky Tank', value: '1/(s+1)', readonly: true }, name: 'process' },
        { type: 'output', x: 750, y: 200, data: { label: 'Level Sensor' } }
    ],
    defaultConnections: [
        { from: 1, to: 2 }
    ],
    criteria: [
        { type: 'gte', metric: 'sinkValue', target: 1 }
    ]
});

// ============================================
// 2. SETUP LEVEL
// ============================================
LevelBase.setup({
    id: 'ch1l7',
    formatSuccessMessage: (m) => `Steady-State Level = ${m.finalValue.toFixed(2)}`,
    formatHintMessage: (m) => {
        if (m.finalValue === 0) return 'Connect the Valve between Pump and Leaky Tank, then run the simulation!';
        const hint = m.finalValue < 1 ? 'Increase the valve gain!' : 'Decrease the valve gain!';
        return `Steady-State Level: ${m.finalValue.toFixed(2)} (target: 1)\n${hint}`;
    }
});