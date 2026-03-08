/**
 * Chapter 1 Level 5 - Our Control Valves Broke Down!
 * Same setup as Ch1L4 (two 1.0 L/s pumps, target 1.5 L/s) but no adjustable valves.
 * Player gets 3 fixed pipe obstructions (×0.80, ×0.80, ×0.94) and must find the right combination.
 */

// ============================================
// 1. REGISTER LEVEL CONFIGURATION
// ============================================
LevelConfig.register('ch1l5', {
    id: 'ch1l5',
    chapter: 1,
    level: 5,
    title: 'Our Control Valves Broke Down!',
    simulationMode: 'instantaneous',
    toolboxBlocks: [
        { type: 'add', label: 'Pipe Connector' },
        { type: 'gain', label: 'Obstruction ×0.80', maxInstances: 1,
          data: { value: 0.8, min: 0, max: 1, step: 0.01, readonly: true, label: 'Obstruction ×0.80' } },
        { type: 'gain', label: 'Obstruction ×0.80', maxInstances: 1,
          data: { value: 0.8, min: 0, max: 1, step: 0.01, readonly: true, label: 'Obstruction ×0.80' } },
        { type: 'gain', label: 'Obstruction ×0.94', maxInstances: 1,
          data: { value: 0.94, min: 0, max: 1, step: 0.01, readonly: true, label: 'Obstruction ×0.94' } }
    ],
    defaultBlocks: [
        { type: 'constant', x: 150, y: 150, data: { label: 'Pump A', min: 0, max: 2, step: 0.1, value: 1, unit: 'L/s', readonly: true } },
        { type: 'constant', x: 150, y: 350, data: { label: 'Pump B', min: 0, max: 2, step: 0.1, value: 1, unit: 'L/s', readonly: true } },
        { type: 'output',   x: 700, y: 250, data: { label: 'Flow Sensor' } }
    ],
    defaultConnections: [],
    criteria: [
        { type: 'closeTo', metric: 'sinkValue', target: 1.5, tolerance: 0.1 }
    ]
});

// ============================================
// 2. SETUP LEVEL (all boilerplate handled by LevelBase)
// ============================================
LevelBase.setup({
    id: 'ch1l5',
    formatSuccessMessage: (m) => `Flow = ${m.sinkValue.toFixed(2)} L/s`,
    formatHintMessage: (m) => {
        const hint = m.sinkValue < 1.5
            ? 'Not enough flow — try a different combination of obstructions!'
            : 'Too much flow — try a different combination of obstructions!';
        return `Flow: ${m.sinkValue.toFixed(2)} L/s (target: 1.5)\n${hint}`;
    }
});
