/**
 * Chapter 1 Level 4 - Too Much Water!
 * Combine the Add block and Gain (valve) to regulate combined flow
 * Goal: Two pumps (1.0 L/s each) → reach exactly 1.5 L/s using add + gain
 */

// ============================================
// 1. REGISTER LEVEL CONFIGURATION
// ============================================
LevelConfig.register('ch1l4', {
    id: 'ch1l4',
    chapter: 1,
    level: 4,
    title: 'Too Much Water!',
    simulationMode: 'instantaneous',
    toolboxBlocks: [
        { type: 'add', label: 'Pipe Connector' },
        { type: 'gain', label: 'Valve', data: { min: 0, max: 1, step: 0.01, value: 1 } }
    ],
    defaultBlocks: [
        { type: 'constant', x: 150, y: 150, data: { label: 'Pump A', min: 0, max: 2, step: 0.1, value: 1, unit: 'L/s', readonly: true } },
        { type: 'constant', x: 150, y: 350, data: { label: 'Pump B', min: 0, max: 2, step: 0.1, value: 1, unit: 'L/s', readonly: true } },
        { type: 'output',   x: 700, y: 250, data: { label: 'Flow Sensor' } }
    ],
    defaultConnections: [],
    criteria: [
        { type: 'closeTo', metric: 'sinkValue', target: 1.5, tolerance: 0.01 }
    ]
});

// ============================================
// 2. SETUP LEVEL (all boilerplate handled by LevelBase)
// ============================================
LevelBase.setup({
    id: 'ch1l4',
    formatSuccessMessage: (m) => `Flow = ${m.sinkValue.toFixed(2)} L/s`,
    formatHintMessage: (m) => {
        const hint = m.sinkValue < 1.5
            ? 'Not enough flow — adjust your valve settings!'
            : 'Too much flow — reduce one or both valves!';
        return `Flow: ${m.sinkValue.toFixed(2)} L/s (target: 1.5)\n${hint}`;
    }
});
