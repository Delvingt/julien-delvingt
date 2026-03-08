/**
 * LevelBase — Shared infrastructure for all levels.
 * Eliminates boilerplate by providing generic signal propagation,
 * completion checking, caching, and UI updates.
 *
 * Usage in a level JS file:
 *   LevelConfig.register('chXlY', { ... });
 *   LevelBase.setup({ id: 'chXlY' });
 */

const LevelBase = {

    // ---- internal state ----
    _levelCompleted: false,
    _config: null,       // full LevelConfig entry
    _hooks: {},

    /**
     * Entry point — call once from every level JS file.
     * @param {object} opts
     * @param {string} opts.id               - LevelConfig id (e.g. 'ch1l1')
     * @param {function} [opts.onPropagate]  - called after generic propagation with (nodeValues)
     * @param {function} [opts.onSimulate]   - called inside runSimulation after propagation
     * @param {function} [opts.formatSuccessMessage] - (metrics) => string shown on success
     * @param {function} [opts.formatHintMessage]    - (metrics, criteria) => string shown on wrong answer
     */
    setup(opts) {
        const config = LevelConfig.get(opts.id);
        if (!config) {
            console.error(`LevelBase: no LevelConfig found for "${opts.id}"`);
            return;
        }

        this._config = config;
        this._hooks = opts;
        this._levelCompleted = false;

        // Expose LEVEL_CONFIG globally (eliminates duplicate in level JS)
        window.LEVEL_CONFIG = {
            id: config.id,
            name: config.title,
            chapter: config.chapter,
            level: config.level,
            criteria: config.criteria || []
        };

        window.CURRENT_LEVEL = window.LEVEL_CONFIG;

        // Define the functions that initSimulator.js and HTML onclick expect
        window.initializeLevel = () => this.initializeLevel();
        window.runSimulation   = () => this.runSimulation();
    },

    // ==================================================
    // Initialization (called by initSimulator.js)
    // ==================================================
    initializeLevel() {
        console.log(`Initializing Level: ${this._config.title}`);
        this.checkPreviousCompletion();
        if (this._config.simulationMode !== 'dynamic') {
            this.setupLiveSimulation();
            setTimeout(() => this.propagateSignals(), 100);
        }
    },

    // ==================================================
    // Live simulation listeners
    // ==================================================
    setupLiveSimulation() {
        const container = document.getElementById('drawflow');
        if (container) {
            container.addEventListener('input', () => this.propagateSignals());
        }

        if (window.model?.editor) {
            model.editor.on('connectionCreated', () => this.propagateSignals());
            model.editor.on('connectionRemoved', () => this.propagateSignals());
        }
    },

    // ==================================================
    // Generic topological-sort signal propagation
    // ==================================================
    propagateSignals() {
        if (!window.model?.editor) return;

        const flowData = model.getFlowData();
        const nodes = flowData.drawflow.Home.data;

        // Build adjacency: for each node, which nodes feed into it?
        const inputsMap = {};   // nodeId -> [{ nodeId, inputPort, outputPort }]
        for (const id in nodes) {
            inputsMap[id] = [];
            for (const inp in nodes[id].inputs) {
                for (const conn of nodes[id].inputs[inp].connections) {
                    inputsMap[id].push({ nodeId: conn.node, inputPort: inp, outputPort: conn.output });
                }
            }
        }

        // Topological sort
        const visited = new Set();
        const order = [];
        const visit = (id) => {
            if (visited.has(id)) return;
            visited.add(id);
            for (const dep of inputsMap[id]) visit(dep.nodeId);
            order.push(id);
        };
        Object.keys(nodes).forEach(visit);

        // Evaluate in order
        const values = {};  // nodeId -> computed value

        for (const id of order) {
            const node = nodes[id];
            const blockConfig = BlockRegistry.get(node.class);
            const numInputs  = blockConfig ? blockConfig.inputs  : (Object.keys(node.inputs).length);
            const numOutputs = blockConfig ? blockConfig.outputs : (Object.keys(node.outputs).length);

            if (numInputs === 0) {
                // Source block — read from DOM via BlockRegistry.getValue
                const el = document.getElementById(`node-${id}`);
                if (blockConfig?.getValue && el) {
                    values[id] = blockConfig.getValue(el);
                } else {
                    values[id] = 0;
                }
            } else {
                // Collect input values
                const inVals = inputsMap[id].map(dep => values[dep.nodeId] ?? 0);
                const connected = inputsMap[id].length > 0;

                if (!connected) {
                    values[id] = null; // disconnected
                } else {
                    // Processing based on block class
                    switch (node.class) {
                        case 'gain': {
                            const el = document.getElementById(`node-${id}`);
                            const k = blockConfig?.getValue ? blockConfig.getValue(el) : 1;
                            values[id] = (inVals[0] ?? 0) * k;
                            break;
                        }
                        case 'add':
                            values[id] = (inVals[0] ?? 0) + (inVals[1] ?? 0);
                            break;
                        case 'sub':
                            values[id] = (inVals[0] ?? 0) - (inVals[1] ?? 0);
                            break;
                        default:
                            // Passthrough (first input)
                            values[id] = inVals[0] ?? 0;
                            break;
                    }
                }
            }

            // Update sink block displays
            if (numOutputs === 0) {
                const el = document.getElementById(`node-${id}`);
                if (el) {
                    const display = el.querySelector('.output-display');
                    if (display) {
                        const v = values[id];
                        if (v === null || v === undefined) {
                            display.textContent = '--';
                            display.className = 'output-display disconnected';
                        } else {
                            display.textContent = v.toFixed(2);
                            // Visual feedback: use criteria system if available
                            const criteria = this._config.criteria;
                            if (Array.isArray(criteria) && criteria.length > 0 && window.results) {
                                const { success } = window.results.checkCriteria(criteria, v);
                                display.className = success ? 'output-display at-target' : 'output-display';
                                if (success) this.checkLevelCompletion(v);
                            } else {
                                display.className = 'output-display';
                            }
                        }
                    }
                }
            }
        }

        // Call custom hook if provided
        if (this._hooks.onPropagate) {
            this._hooks.onPropagate(values);
        }

        // Store latest values for runSimulation
        this._lastValues = values;
        this._lastNodes = nodes;
    },

    // ==================================================
    // Simulate button handler
    // ==================================================
    runSimulation() {
        this.propagateSignals();

        if (window.results?.simulate) {
            results.simulate();
        }

        // For dynamic levels, update sink displays with the final simulation output
        if (this._config.simulationMode === 'dynamic') {
            this.updateSinkDisplaysFromSimulation();
        }

        const nodes = this._lastNodes;
        const values = this._lastValues;
        if (!nodes || !values) return;

        // Find sink node value
        let sinkValue = null;
        let hasSink = false;
        let allConnected = true;

        for (const id in nodes) {
            const blockConfig = BlockRegistry.get(nodes[id].class);
            const numOutputs = blockConfig ? blockConfig.outputs : Object.keys(nodes[id].outputs).length;
            if (numOutputs === 0) {
                hasSink = true;
                if (values[id] === null || values[id] === undefined) {
                    allConnected = false;
                } else {
                    sinkValue = values[id];
                }
            }
        }

        if (!allConnected || sinkValue === null) {
            this.updateChallengeStatus('Connect all blocks first!', 'error');
            return;
        }

        // Custom hook
        if (this._hooks.onSimulate) {
            this._hooks.onSimulate(sinkValue, values);
            return;
        }

        // Default success check via criteria system
        const criteria = this._config.criteria;
        if (Array.isArray(criteria) && criteria.length > 0) {
            const { success, metrics } = window.results
                ? window.results.checkCriteria(criteria, sinkValue)
                : { success: false, metrics: {} };

            if (success) {
                this.checkLevelCompletion(sinkValue);
                const msg = this._hooks.formatSuccessMessage
                    ? this._hooks.formatSuccessMessage(metrics)
                    : `Output = ${(metrics.finalValue ?? 0).toFixed(2)}`;
                this.updateChallengeStatus(msg, 'success');
            } else {
                const msg = this._hooks.formatHintMessage
                    ? this._hooks.formatHintMessage(metrics, criteria)
                    : `Output: ${(metrics.finalValue ?? 0).toFixed(2)} — criteria not met. Adjust your design!`;
                this.updateChallengeStatus(msg, 'warning');
            }
        }
    },

    // ==================================================
    // Update sink displays from dynamic simulation data
    // ==================================================
    updateSinkDisplaysFromSimulation() {
        const simData = window.results?.simulationData;
        if (!simData?.outputData || simData.outputData.length === 0) return;

        const finalValue = simData.outputData[simData.outputData.length - 1];
        if (finalValue === undefined || finalValue === null) return;

        // Find all sink nodes and update their displays
        const flowData = window.model?.getFlowData();
        if (!flowData) return;
        const nodes = flowData.drawflow.Home.data;

        for (const id in nodes) {
            const blockConfig = BlockRegistry.get(nodes[id].class);
            const numOutputs = blockConfig ? blockConfig.outputs : Object.keys(nodes[id].outputs).length;
            if (numOutputs === 0) {
                const el = document.getElementById(`node-${id}`);
                if (el) {
                    const display = el.querySelector('.output-display');
                    if (display) {
                        display.textContent = finalValue.toFixed(2);
                        display.className = 'output-display';
                    }
                }
            }
        }
    },

    // ==================================================
    // Completion
    // ==================================================
    checkLevelCompletion(sinkValue) {
        if (this._levelCompleted) return;

        const criteria = this._config.criteria;
        if (!criteria || !Array.isArray(criteria) || criteria.length === 0) return;

        const { success, metrics } = window.results
            ? window.results.checkCriteria(criteria, sinkValue)
            : { success: false, metrics: {} };

        if (success) {
            this._levelCompleted = true;
            const msg = this._hooks.formatSuccessMessage
                ? this._hooks.formatSuccessMessage(metrics)
                : `Output = ${(metrics.finalValue ?? 0).toFixed(2)}`;
            this.updateChallengeStatus(msg, 'success');
            this.saveLevelCompletion(metrics.finalValue ?? sinkValue ?? 0);
            this.enableNextLevel();
        }
    },

    checkPreviousCompletion() {
        const completion = cacheManager.getLevelCompletion(this._config.id);
        if (completion?.completed) {
            this._levelCompleted = true;
            this.enableNextLevel();
            console.log('Level previously completed');
        }
    },

    // ==================================================
    // UI helpers
    // ==================================================
    updateChallengeStatus(message, type = '') {
        const el = document.getElementById('challengeStatus');
        if (!el) return;

        if (!message) {
            el.className = 'challenge-status';
            el.innerHTML = '';
            return;
        }

        if (type === 'success') {
            el.innerHTML = `
                <div class="completion-box">
                    <div class="completion-icon"><i class="fas fa-trophy"></i></div>
                    <div class="completion-title">Level Complete!</div>
                    <div class="completion-detail">${message}</div>
                </div>`;
        } else {
            el.textContent = message;
        }

        el.className = 'challenge-status ' + type;
        setTimeout(() => el.classList.add('show'), 10);
    },

    enableNextLevel() {
        // menubar.js renders: .nav-buttons > a (last child is the "Next" link)
        const nextBtn = document.querySelector('.nav-buttons a:last-child');
        if (nextBtn) {
            nextBtn.classList.add('enabled');
            nextBtn.style.pointerEvents = 'auto';
            nextBtn.style.opacity = '1';
        }
    },

    saveLevelCompletion(value) {
        const prev = cacheManager.getLevelCompletion(this._config.id);
        const attempts = (prev?.attempts || 0) + 1;
        cacheManager.saveLevelCompletion(this._config.id, {
            completed: true,
            score: 100,
            flow: value,
            attempts: attempts
        });
    }
};

window.LevelBase = LevelBase;
