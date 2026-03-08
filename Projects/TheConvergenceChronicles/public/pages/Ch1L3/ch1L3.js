/**
 * Chapter 1 Level 3 - Not Enough Water!
 * Learn that blocks can have multiple inputs using the Add block
 * Goal: Wire both Pumps → Pipe Connector (Add) → Flow Sensor to achieve 2.0 L/s
 */

// ============================================
// 1. REGISTER LEVEL CONFIGURATION
// ============================================
LevelConfig.register('ch1l3', {
    id: 'ch1l3',
    chapter: 1,
    level: 3,
    title: 'Not Enough Water!',
    simulationMode: 'instantaneous',
    toolboxBlocks: [{ type: 'add', label: 'Pipe Connector' }],
    defaultBlocks: [
        { type: 'constant', x: 150, y: 150, data: { label: 'Pump A', min: 0, max: 2, step: 0.1, value: 1, unit: 'L/s', readonly: true } },
        { type: 'constant', x: 150, y: 350, data: { label: 'Pump B', min: 0, max: 2, step: 0.1, value: 1, unit: 'L/s', readonly: true } },
        { type: 'output',   x: 700, y: 250, data: { label: 'Flow Sensor' } }
    ],
    defaultConnections: [],
    criteria: [
        { type: 'closeTo', metric: 'sinkValue', target: 2.0, tolerance: 0.01 }
    ]
});

// ============================================
// 2. SETUP LEVEL (all boilerplate handled by LevelBase)
// ============================================
LevelBase.setup({
    id: 'ch1l3',
    formatSuccessMessage: (m) => `Flow = ${m.sinkValue.toFixed(2)} L/s`,
    formatHintMessage: (m) => {
        const hint = m.sinkValue < 2.0
            ? 'Connect both pumps through the Pipe Connector!'
            : 'Too much flow — check your connections!';
        return `Flow: ${m.sinkValue.toFixed(2)} L/s (target: 2.0)\n${hint}`;
    }
});
