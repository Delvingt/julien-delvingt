/**
 * Chapter 1 Level 2 - The Gain Valve
 * Learn about the toolbox, wiring blocks, and the gain (valve) concept
 * Goal: Wire Pump → Valve → Flow Sensor and set gain to 0.5
 */

// ============================================
// 1. REGISTER LEVEL CONFIGURATION
// ============================================
LevelConfig.register('ch1l2', {
    id: 'ch1l2',
    chapter: 1,
    level: 2,
    title: 'The Gain Valve',
    simulationMode: 'instantaneous',
    toolboxBlocks: [{ type: 'gain', data: {label: 'Valve', min: 0, max: 1, step: 0.1, value: 0 }}],
    defaultBlocks: [
        { type: 'constant', x: 150, y: 200, data: { label: 'Pump', min: 0, max: 2, step: 0.1, value: 1, unit: 'l/s', readonly: true } },
        { type: 'output', x: 700, y: 200, data: { label: 'Flow Sensor' } }
    ],
    defaultConnections: [],
    criteria: [
        { type: 'closeTo', metric: 'sinkValue', target: 0.5, tolerance: 0.01 }
    ]
});

// ============================================
// 3. SETUP LEVEL (all boilerplate handled by LevelBase)
// ============================================
LevelBase.setup({
    id: 'ch1l2',
    formatSuccessMessage: (m) => `Flow = ${m.sinkValue.toFixed(2)} L/s`,
    formatHintMessage: (m) => {
        const hint = m.sinkValue < 0.5 ? 'Increase the valve gain!' : 'Decrease the valve gain!';
        return `Flow: ${m.sinkValue.toFixed(2)} L/s (target: 0.5)\n${hint}`;
    }
});