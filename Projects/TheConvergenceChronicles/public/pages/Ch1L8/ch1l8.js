/**
 * Chapter 1 Level 8 - We Need to Fill That Tank
 * Combines two pump sources via a pipe connector (add block),
 * then controls flow with a valve (gain) into the leaky tank 1/(s+1).
 * Goal: Steady-state level = 1.5. Two pumps @ 1 L/s, so valve = 0.75.
 */

// ============================================
// 1. REGISTER LEVEL CONFIGURATION
// ============================================
LevelConfig.register('ch1l8', {
    id: 'ch1l8',
    chapter: 1,
    level: 8,
    title: 'We Need to Fill That Tank',
    simulationMode: 'dynamic',
    T: 10,
    dt: 0.1,
    toolboxBlocks: [
        { type: 'add', data: { label: 'Pipe Connector' } },
        { type: 'gain', data: { label: 'Valve', min: 0, max: 2, step: 0.01, value: 1 } }
    ],
    defaultBlocks: [
        { type: 'constant', x: 100, y: 150, data: { label: 'Pump A', value: 1.0, readonly: true } },
        { type: 'constant', x: 100, y: 350, data: { label: 'Pump B', value: 1.0, readonly: true } },
        { type: 'transfer_function', x: 550, y: 250, data: { label: 'Leaky Tank', value: '1/(s+1)', readonly: true }, name: 'process' },
        { type: 'output', x: 800, y: 250, data: { label: 'Level Sensor' } }
    ],
    defaultConnections: [
        { from: 2, to: 3 }
    ],
    criteria: [
        { type: 'closeTo', metric: 'sinkValue', target: 1.5, tolerance: 0.05 }
    ]
});

// ============================================
// 2. SETUP LEVEL
// ============================================
LevelBase.setup({
    id: 'ch1l8',
    formatSuccessMessage: (m) => `Steady-State Level = ${m.finalValue.toFixed(2)}m`,
    formatHintMessage: (m) => {
        if (m.finalValue === 0) return 'Connect both Pumps → Pipe Connector → Valve → Leaky Tank, then run the simulation!';
        const hint = m.finalValue < 1.5 ? 'Increase the valve gain!' : 'Decrease the valve gain!';
        return `Steady-State Level: ${m.finalValue.toFixed(2)}m (target: 1.5m)\n${hint}`;
    }
});