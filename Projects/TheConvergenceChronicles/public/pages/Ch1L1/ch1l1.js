/**
 * Chapter 1 Level 1 - The Water Source
 * Learn the fundamental concept of input -> output relationships
 * Goal: Set the constant value to achieve a target flow of 1.0
 */

// ============================================
// 1. REGISTER LEVEL CONFIGURATION
// ============================================
LevelConfig.register('ch1l1', {
    id: 'ch1l1',
    chapter: 1,
    level: 1,
    title: 'The Water Source',
    simulationMode: 'instantaneous',
    toolboxBlocks: [],
    defaultBlocks: [
        { type: 'constant', x: 150, y: 150, data: { label: 'Pump', min: 0, max: 2, step: 0.1, value: 0, unit: '' } },
        { type: 'output', x: 500, y: 150, data: { label: 'Flow Sensor' } }
    ],
    defaultConnections: [
        { from: 0, to: 1 }
    ],
    criteria: [
        { type: 'closeTo', metric: 'sinkValue', target: 1.0, tolerance: 0.01 }
    ]
});

// ============================================
// 2. SETUP LEVEL (all boilerplate handled by LevelBase)
// ============================================
LevelBase.setup({
    id: 'ch1l1',
    formatSuccessMessage: (m) => `Flow = ${m.sinkValue.toFixed(2)} L/s`,
    formatHintMessage: (m) => {
        const hint = m.sinkValue < 1.0 ? 'Increase the value!' : 'Decrease the value!';
        return `Flow: ${m.sinkValue.toFixed(2)} L/s (target: 1.0)\n${hint}`;
    }
});
