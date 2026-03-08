/**
 * Chapter X Level Y - Level Title
 * Brief description of what this level teaches
 */

// ============================================
// 1. (OPTIONAL) REGISTER CUSTOM BLOCKS
// ============================================
// BlockRegistry.register('my_custom_block', {
//     html: `<div>
//         <div class="node-Title">Custom Block</div>
//         <div class="output-display">--</div>
//     </div>`,
//     inputs: 1,
//     outputs: 0,
//     class: 'my_custom_block',
//     defaultData: { label: 'Custom' },
//     onRender: (nodeElement, data) => { /* setup */ },
//     getValue: (nodeElement) => { return 0; }
// });

// ============================================
// 2. REGISTER LEVEL CONFIGURATION
// ============================================
LevelConfig.register('chXlY', {                          // CHANGE: level id
    id: 'chXlY',                                          // CHANGE: level id
    chapter: 1,                                            // CHANGE: chapter number
    level: 1,                                              // CHANGE: level number
    title: 'Level Title',                                  // CHANGE: level title
    simulationMode: 'instantaneous',                       // 'instantaneous' or 'dynamic'
    toolboxBlocks: [],                                     // Block types available in toolbox for drag & drop
    defaultBlocks: [                                       // Blocks pre-placed on canvas
        { type: 'constant', x: 150, y: 150, data: { label: 'Input', min: 0, max: 1, step: 0.01, value: 0, unit: '' } },
        { type: 'output',   x: 500, y: 150, data: { label: 'Output' } }
    ],
    defaultConnections: [                                  // Index-based connections into defaultBlocks
        { from: 0, to: 1 }
    ],
    criteria: {                                            // CHANGE: success criteria
        targetFlow: 1.0,
        tolerance: 0.01
    }
});

// ============================================
// 3. SETUP LEVEL (all boilerplate handled by LevelBase)
// ============================================
LevelBase.setup({
    id: 'chXlY',                                          // CHANGE: must match level id above

    // Optional hooks — uncomment and customise as needed:
    // formatSuccessMessage: (value) => `Output = ${value.toFixed(2)}`,
    // formatHintMessage: (value, criteria) => `Output: ${value.toFixed(2)} — try adjusting!`,
    // onPropagate: (nodeValues) => { /* custom logic after signal propagation */ },
    // onSimulate: (sinkValue, nodeValues) => { /* fully custom simulation handler */ },
});
