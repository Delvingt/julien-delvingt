/**
 * Chapter 1 Level 6 - We Need to Store Water!
 * Introduces the process concept — a water tank modeled as an integrator (1/s).
 * First dynamic (time-domain) simulation level in the main campaign.
 * Goal: Tank level >= 5.0 at t=10s. With pump=1.0 and gain=k: level(t) = k * t
 */

// ============================================
// 1. REGISTER LEVEL CONFIGURATION
// ============================================
LevelConfig.register('ch1l6', {
    id: 'ch1l6',
    chapter: 1,
    level: 6,
    title: 'We Need to Store Water!',
    simulationMode: 'dynamic',
    T: 15,
    dt: 0.1,
    toolboxBlocks: [{ type: 'gain', data: { label: 'Valve', min: 0, max: 1, step: 0.1, value: 1,} }],
    defaultBlocks: [
        { type: 'constant', x: 100, y: 200, data: { label: 'Pump', value: 1.0, readonly: true } },
        { type: 'integrator', x: 450, y: 200, data: { label: 'Water Tank' }, name: 'process' },
        { type: 'output', x: 750, y: 200, data: { label: 'Level Sensor' } }
    ],
    defaultConnections: [
        { from: 1, to: 2 }
    ],
    criteria: [
        { type: 'gte', metric: 'outputAtTime', time: 10, target: 5.0 }
    ]
});

// ============================================
// 2. SETUP LEVEL
// ============================================
LevelBase.setup({
    id: 'ch1l6',
    formatSuccessMessage: (m) => `Tank Level at 10s = ${m.outputAtTime(10).toFixed(2)}`,
    formatHintMessage: (m) => {
        const v = m.outputAtTime(10);
        if (v === 0) return 'Connect the Valve between Pump and Water Tank, then run the simulation!';
        return `Tank Level at 10s: ${v.toFixed(2)} (need \u2265 5.0)\nIncrease the valve gain to fill faster!`;
    }
});