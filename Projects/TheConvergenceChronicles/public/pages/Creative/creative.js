/**
 * Creative Sandbox
 * Free-form block diagram editor with no win condition.
 * Uses LevelConfig + LevelBase architecture.
 */

// ============================================
// 1. REGISTER LEVEL CONFIGURATION
// ============================================
LevelConfig.register('creative', {
    id: 'creative',
    chapter: 0,
    level: 0,
    title: 'Creative Sandbox',
    simulationMode: 'dynamic',
    T: 25,
    dt: 0.1,
    toolboxBlocks: ['setpoint','constant', 'gain', 'integrator', 'derivative', 'add', 'sub', 'transfer_function', 'output'],
    defaultBlocks: [],
    defaultConnections: [],
    criteria: {}
});

// ============================================
// 2. SETUP LEVELBASE
// ============================================
LevelBase.setup({
    id: 'creative',
    onSimulate: function(sinkValue, values) {
        const simData = window.results?.simulationData;
        if (!simData?.outputData) {
            LevelBase.updateChallengeStatus('Build a block diagram and connect blocks to simulate!', 'warning');
        }
    }
});
