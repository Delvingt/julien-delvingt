/**
 * Block Registry - Allows levels to register custom blocks
 * Blocks registered here can be used in any level that includes them in their toolbox
 */
const BlockRegistry = {
    blocks: {},

    /**
     * Register a block type
     * @param {string} type - Unique block type identifier
     * @param {object} config - Block configuration
     */
    register(type, config) {
        this.blocks[type] = {
            inputs: 1,
            outputs: 1,
            class: type,
            defaultData: {},
            ...config
        };
    },

    /**
     * Get a registered block configuration
     * @param {string} type - Block type identifier
     * @returns {object|null} Block configuration or null if not found
     */
    get(type) {
        return this.blocks[type] || null;
    },

    /**
     * Get all registered block types
     * @returns {string[]} Array of block type identifiers
     */
    getAll() {
        return Object.keys(this.blocks);
    },

    /**
     * Check if a block type is registered
     * @param {string} type - Block type identifier
     * @returns {boolean}
     */
    has(type) {
        return type in this.blocks;
    }
};

// Expose BlockRegistry globally so level scripts can register blocks
window.BlockRegistry = BlockRegistry;

// Register default blocks (available to all levels)
BlockRegistry.register('constant', {
    html: `<div>
        <div class="node-Title">Constant</div>
        <div class="slider-container">
            <input type="range" class="node-slider" min="-100" max="100" step="0.1" value="1" />
            <div class="slider-value-row">
                <input type="number" class="slider-number-input" min="-100" max="100" step="0.1" value="1" />
                <span class="slider-unit"></span>
            </div>
        </div>
    </div>`,
    inputs: 0,
    outputs: 1,
    class: 'constant',
    defaultData: { value: 1, min: -100, max: 100, step: 0.1, label: 'Constant', unit: '' },
    onRender: (nodeElement, data) => {
        const slider = nodeElement.querySelector('.node-slider');
        const numberInput = nodeElement.querySelector('.slider-number-input');
        const title = nodeElement.querySelector('.node-Title');
        const unit = nodeElement.querySelector('.slider-unit');

        if (title && data.label) title.textContent = data.label;
        if (unit && data.unit) unit.textContent = data.unit;

        if (!slider) return; // Stale cache with old HTML structure

        slider.min = data.min ?? 0;
        slider.max = data.max ?? 10;
        slider.step = data.step ?? 0.1;
        slider.value = data.value ?? 1;

        if (numberInput) {
            numberInput.min = slider.min;
            numberInput.max = slider.max;
            numberInput.step = slider.step;
            numberInput.value = slider.value;
        }

        if (data.readonly) {
            slider.disabled = true;
            slider.style.opacity = '0.6';
            slider.style.pointerEvents = 'none';
            if (numberInput) numberInput.readOnly = true;
        }

        // Slider → number input
        slider.addEventListener('input', () => {
            if (numberInput) numberInput.value = slider.value;
        });

        // Number input → slider (clamp on overflow)
        if (numberInput) {
            numberInput.addEventListener('change', () => {
                let v = parseFloat(numberInput.value) || 0;
                const min = parseFloat(slider.min);
                const max = parseFloat(slider.max);
                v = Math.min(Math.max(v, min), max);
                numberInput.value = v;
                slider.value = v;
            });
        }

        // Prevent Drawflow from intercepting drag/click events
        ['mousedown', 'pointerdown', 'touchstart'].forEach(evt => {
            slider.addEventListener(evt, (e) => e.stopPropagation());
            if (numberInput) numberInput.addEventListener(evt, (e) => e.stopPropagation());
        });
    },
    getValue: (nodeElement) => {
        const slider = nodeElement.querySelector('.node-slider');
        return slider ? parseFloat(slider.value) || 0 : 0;
    }
});

BlockRegistry.register('setpoint', {
    html: `<div>
        <div class="node-Title">Set Point</div>
        <div class="slider-container">
            <input type="range" class="node-slider" min="-100" max="100" step="0.1" value="1" />
            <div class="slider-value-row">
                <input type="number" class="slider-number-input" min="-100" max="100" step="0.1" value="1" />
                <span class="slider-unit"></span>
            </div>
        </div>
    </div>`,
    inputs: 0,
    outputs: 1,
    class: 'setpoint',
    defaultData: { value: 1, min: -100, max: 100, step: 0.1, label: 'Set Point', unit: '' },
    onRender: (nodeElement, data) => {
        const slider = nodeElement.querySelector('.node-slider');
        const numberInput = nodeElement.querySelector('.slider-number-input');
        const title = nodeElement.querySelector('.node-Title');
        const unit = nodeElement.querySelector('.slider-unit');

        if (title && data.label) title.textContent = data.label;
        if (unit && data.unit) unit.textContent = data.unit;

        if (!slider) return;

        slider.min = data.min ?? 0;
        slider.max = data.max ?? 10;
        slider.step = data.step ?? 0.1;
        slider.value = data.value ?? 1;

        if (numberInput) {
            numberInput.min = slider.min;
            numberInput.max = slider.max;
            numberInput.step = slider.step;
            numberInput.value = slider.value;
        }

        if (data.readonly) {
            slider.disabled = true;
            slider.style.opacity = '0.6';
            slider.style.pointerEvents = 'none';
            if (numberInput) numberInput.readOnly = true;
        }

        slider.addEventListener('input', () => {
            if (numberInput) numberInput.value = slider.value;
        });

        if (numberInput) {
            numberInput.addEventListener('change', () => {
                let v = parseFloat(numberInput.value) || 0;
                const min = parseFloat(slider.min);
                const max = parseFloat(slider.max);
                v = Math.min(Math.max(v, min), max);
                numberInput.value = v;
                slider.value = v;
            });
        }

        ['mousedown', 'pointerdown', 'touchstart'].forEach(evt => {
            slider.addEventListener(evt, (e) => e.stopPropagation());
            if (numberInput) numberInput.addEventListener(evt, (e) => e.stopPropagation());
        });
    },
    getValue: (nodeElement) => {
        const slider = nodeElement.querySelector('.node-slider');
        return slider ? parseFloat(slider.value) || 0 : 0;
    }
});

BlockRegistry.register('gain', {
    html: `<div>
        <div class="node-Title">Gain</div>
        <div class="node-subTitle">u × k</div>
        <div class="slider-container">
            <input type="range" class="node-slider" min="-100" max="100" step="0.1" value="1" />
            <div class="slider-value-row">
                <input type="number" class="slider-number-input" min="-100" max="100" step="0.1" value="1" />
            </div>
        </div>
    </div>`,
    inputs: 1,
    outputs: 1,
    class: 'gain',
    defaultData: { value: 1, min: -100, max: 100, step: 0.1, label: 'Gain' },
    onRender: (nodeElement, data) => {
        const title = nodeElement.querySelector('.node-Title');
        const slider = nodeElement.querySelector('.node-slider');
        const numberInput = nodeElement.querySelector('.slider-number-input');

        if (data.label) title.textContent = data.label;

        if (slider && numberInput) {
            slider.min = data.min ?? -100;
            slider.max = data.max ?? 100;
            slider.step = data.step ?? 0.1;
            slider.value = data.value ?? 1;
            numberInput.min = slider.min;
            numberInput.max = slider.max;
            numberInput.step = slider.step;
            numberInput.value = slider.value;

            if (data.readonly) {
                slider.disabled = true;
                slider.style.opacity = '0.6';
                slider.style.pointerEvents = 'none';
                numberInput.readOnly = true;
            }

            // Slider → number input
            slider.addEventListener('input', () => {
                numberInput.value = slider.value;
            });

            // Number input → slider (clamp on overflow)
            numberInput.addEventListener('change', () => {
                let v = parseFloat(numberInput.value) || 0;
                const min = parseFloat(slider.min);
                const max = parseFloat(slider.max);
                v = Math.min(Math.max(v, min), max);
                numberInput.value = v;
                slider.value = v;
            });

            // Prevent Drawflow from intercepting drag/click events
            ['mousedown', 'pointerdown', 'touchstart'].forEach(evt => {
                slider.addEventListener(evt, (e) => e.stopPropagation());
                numberInput.addEventListener(evt, (e) => e.stopPropagation());
            });
        }
    },
    getValue: (nodeElement) => {
        const slider = nodeElement.querySelector('.node-slider');
        return slider ? parseFloat(slider.value) || 1 : 1;
    }
});

BlockRegistry.register('integrator', {
    html: `<div>
        <div class="node-Title">Integral</div>
        <div class="node-subTitle">1/s</div>
    </div>`,
    inputs: 1,
    outputs: 1,
    class: 'integrator',
    defaultData: { label: 'Integral' },
    onRender: (nodeElement, data) => {
        const title = nodeElement.querySelector('.node-Title');
        if (data.label) title.textContent = data.label;
    }
});

BlockRegistry.register('derivative', {
    html: `<div>
        <div class="node-Title">Derivative</div>
        <div class="node-subTitle">s × Td</div>
        <input type="number" value="0.1" step="0.01" min="-100" max="100" hidden />
    </div>`,
    inputs: 1,
    outputs: 1,
    class: 'derivative',
    defaultData: { value: 0.1, label: 'Derivative' },
    onRender: (nodeElement, data) => {
        const title = nodeElement.querySelector('.node-Title');
        const input = nodeElement.querySelector('input[type="number"]');
        if (data.label) title.textContent = data.label;
        if (input) input.value = data.value ?? 0.1;
    },
    getValue: (nodeElement) => {
        const input = nodeElement.querySelector('input[type="number"]');
        return input ? parseFloat(input.value) || 0.1 : 0.1;
    }
});

BlockRegistry.register('sub', {
    html: `<div>
        <div class="node-Title">Subtract</div>
        <div class="node-subTitle">u1 - u2</div>
    </div>`,
    inputs: 2,
    outputs: 1,
    class: 'sub',
    defaultData: { label: 'Subtract' },
    onRender: (nodeElement, data) => {
        const title = nodeElement.querySelector('.node-Title');
        if (data.label) title.textContent = data.label;
    }
});

BlockRegistry.register('add', {
    html: `<div>
        <div class="node-Title">Add</div>
        <div class="node-subTitle">u1 + u2</div>
    </div>`,
    inputs: 2,
    outputs: 1,
    class: 'add',
    defaultData: { label: 'Add' },
    onRender: (nodeElement, data) => {
        const title = nodeElement.querySelector('.node-Title');
        if (data.label) title.textContent = data.label;
    }
});

BlockRegistry.register('transfer_function', {
    html: `<div>
        <div class="node-Title">Transfer Function</div>
        <div class="node-subTitle">H(s) =</div>
        <input type="text" df-name="tf" value="1/(s+1)" style="width: 120px">
    </div>`,
    inputs: 1,
    outputs: 1,
    class: 'transfer_function',
    defaultData: { value: '1/(s+1)', label: 'Transfer Function' },
    onRender: (nodeElement, data) => {
        const title = nodeElement.querySelector('.node-Title');
        const input = nodeElement.querySelector('input[type="text"]');
        if (data.label) title.textContent = data.label;
        if (input) {
            input.value = data.value ?? '1/(s+1)';
            if (data.readonly) input.readOnly = true;
        }
    },
    getValue: (nodeElement) => {
        const input = nodeElement.querySelector('input[type="text"]');
        return input ? input.value || "1/(s+1)" : "1/(s+1)";
    }
});

BlockRegistry.register('output', {
    html: `<div>
        <div class="node-Title">Output</div>
        <div class="output-display">--</div>
        <div class="output-unit"></div>
    </div>`,
    inputs: 1,
    outputs: 0,
    class: 'output',
    defaultData: { label: 'Output', unit: '' },
    onRender: (nodeElement, data) => {
        const title = nodeElement.querySelector('.node-Title');
        const unit = nodeElement.querySelector('.output-unit');
        if (data.label) title.textContent = data.label;
        if (data.unit && unit) unit.textContent = data.unit;
    }
});

class ProcessModel {
    constructor({containerId = "drawflow", setPointNode = [true, 1], processNode = [true, "1/(s+1)"], levelConfig = null }) {
        // Parameters
        this.editor = null;
        this.drawflowContainer = document.getElementById(containerId);
        this.setPointNode = setPointNode;                                           // [Add as default, Value, Readonly]
        this.processNode = processNode;                                             // [Add as default, Expression, , Readonly]
        this.levelConfig = levelConfig;                                             // Optional level configuration

        // Initialize if container exists
        if (this.drawflowContainer) {
            this.init();
        }
    }

    ///////////////////
    // Initialize    //
    ///////////////////
    init() {
        this.initDrawflowContainer();
        this.setupEventListeners();
        this.addDefaultBlocks();
    }

    ///////////////////
    // init Drawflow //
    ///////////////////
    initDrawflowContainer() {
        this.editor = new Drawflowoverride(this.drawflowContainer);
        this.editor.reroute = true;
        this.editor.zoom_enable = true;
        this.editor.start();
    }

    /////////////////////////
    // Setup Event Listeners //
    /////////////////////////
    setupEventListeners() {
        // Zoom event listener
        this.drawflowContainer.addEventListener("wheel", (event) => this.handleZoom(event));
        
        // Drag and drop listeners
        this.setupDragAndDrop();
    }

    //////////
    // Zoom //
    //////////
    handleZoom(event) {
        event.preventDefault();
        const zoomIntensity = 0.1;
        const delta = Math.sign(event.deltaY);
        if (delta < 0) {
            this.editor.zoom_in();
        } else {
            this.editor.zoom_out();
        }
    }

    ///////////////////////
    // Reset Node Scheme //
    ///////////////////////
    resetNodeScheme() {
        console.log(this.editor.export());
        this.editor.clearModuleSelected();
        this.addDefaultBlocks();
    }

    ///////////////////////////////////
    // Add Default Nodes SP and G(s) //
    ///////////////////////////////////
    addDefaultBlocks() {
        // If level config specifies default blocks, place them declaratively
        if (this.levelConfig?.defaultBlocks?.length > 0) {
            const nodeIds = [];

            // Place all blocks
            this.levelConfig.defaultBlocks.forEach((blockDef) => {
                const nodeId = this.addNode(
                    blockDef.type,
                    blockDef.x || 150,
                    blockDef.y || 150,
                    blockDef.data || {}
                );
                // Allow level config to set a custom Drawflow node name (e.g. 'process')
                if (blockDef.name && nodeId) {
                    this.editor.drawflow.drawflow.Home.data[nodeId].name = blockDef.name;
                }
                nodeIds.push(nodeId);
            });

            // Create connections (index-based references into defaultBlocks)
            if (this.levelConfig.defaultConnections) {
                this.levelConfig.defaultConnections.forEach(conn => {
                    const fromId = nodeIds[conn.from];
                    const toId = nodeIds[conn.to];
                    if (fromId && toId) {
                        this.editor.addConnection(
                            fromId, toId,
                            conn.fromPort || 'output_1',
                            conn.toPort || 'input_1'
                        );
                    }
                });
            }
            return;
        }

        let html;
        // Setpoint block (upper-left)
        if (this.setPointNode[0]){
            html = `<div>
            <div class="node-Title">Set Point</div>
                <input type="number" value="${this.setPointNode[1]}" step="0.1" min="-100" max="100" ${this.setPointNode[2] ? 'readonly' : ''} />
            </div>`;
            this.editor.addNode("setpoint", 0, 1, 50, 50, "constant", {erasable: false}, html);
        }

        // Process block (upper-right)
        if (this.processNode[0]) {
            html = `
                <div>
                    <div class="node-Title">Process</div>
                    <div class="node-subTitle">H(s) =</div>
                    <input type="text" df-name="tf" value="${this.processNode[1]}" style="width: 120px" ${this.processNode[2] ? 'readonly' : ''}/>
                </div>`;
            this.editor.addNode("process", 1, 1, 800, 50, "transfer_function", {erasable: false}, html);
        }
    }

    //////////////
    // Add Node //
    //////////////
    addNode(type, posX, posY, data = {}) {
        // First check BlockRegistry for registered blocks
        const blockConfig = BlockRegistry.get(type);

        if (blockConfig) {
            // Use registered block configuration
            const nodeData = { ...blockConfig.defaultData, ...data };
            const nodeId = this.editor.addNode(
                type,
                blockConfig.inputs,
                blockConfig.outputs,
                posX,
                posY,
                blockConfig.class,
                nodeData,
                blockConfig.html
            );

            // Call onRender callback if provided
            if (blockConfig.onRender) {
                // Defer to next tick to ensure DOM is updated
                setTimeout(() => {
                    const nodeElement = document.getElementById(`node-${nodeId}`);
                    if (nodeElement) {
                        blockConfig.onRender(nodeElement, nodeData, this.editor);
                    }
                }, 0);
            }

            return nodeId;
        }

        // Fallback for unregistered types (legacy support)
        let node_name = type;
        let node_class = type;
        let inputs = 1;
        let outputs = 1;
        let html = "";

        if (type === "constant") {
            html = `<div>
                        <div class="node-Title">Constant</div>
                        <input type="number" value="1" step="0.1"/>
                    </div>`;
            inputs = 0;
        }
        else if (type === "gain") {
            html = `<div>
                        <div class="node-Title">Gain</div>
                        <div class="node-subTitle">u × k</div>
                        <input type="number" value="1" step="0.1" min="-100" max="100" />
                    </div>`;
        } else if (type === "integrator") {
            html = `<div>
                        <div class="node-Title">Integral</div>
                        <div class="node-subTitle">1/s</div>
                    </div>`;
        } else if (type === "derivative") {
            html = `<div>
                        <div class="node-Title">Derivative</div>
                        <div class="node-subTitle">s × Td</div>
                        <input type="number" value="0.1" step="0.01" min="-100" max="100" hidden />
                    </div>`;
        } else if (type === "sub") {
            html = `<div>
                        <div class="node-Title">Substract</div>
                        <div class="node-subTitle">u1 - u2</div>
                    </div>`;
            inputs = 2; // Subtraction needs two inputs
        } else if (type === "add") {
            html = `<div>
                        <div class="node-Title">Add</div>
                        <div class="node-subTitle">u1 + u2</div>
                    </div>`;
            inputs = 2; // Addition needs two inputs
        } else if (type === "transfer_function") {
            html = `
                    <div>
                        <div class="node-Title">Transfer Function</div>
                        <div class="node-subTitle">H(s) =</div>
                        <input type="text" df-name="tf" value="1/(s+1)" style="width: 120px">
                    </div>`;
        }

        return this.editor.addNode(node_name, inputs, outputs, posX, posY, node_class, data, html);
    }

    ////////////////////////
    // Drag and Drop Setup //
    ////////////////////////
    setupDragAndDrop() {
        // Auto-generate toolbox items from level config
        if (this.levelConfig?.toolboxBlocks?.length > 0) {
            const toolboxContent = document.querySelector('.toolbox-content');
            if (toolboxContent) {
                toolboxContent.innerHTML = '';

                this.levelConfig.toolboxBlocks.forEach((blockDef, index) => {
                    const config = typeof blockDef === 'string'
                        ? { type: blockDef }
                        : blockDef;

                    const blockConfig = BlockRegistry.get(config.type);
                    if (!blockConfig) {
                        console.warn(`Toolbox: unknown block type "${config.type}"`);
                        return;
                    }

                    const label = config.label
                        || config.data?.label
                        || blockConfig.defaultData?.label
                        || config.type;

                    const item = document.createElement('div');
                    item.className = 'drag-item';
                    item.draggable = true;
                    item.setAttribute('data-node', config.type);
                    item.textContent = label;

                    // Assign unique toolbox ID for maxInstances tracking
                    const toolboxId = `tb-${index}`;
                    item.setAttribute('data-toolbox-id', toolboxId);
                    if (config.maxInstances != null) {
                        item.setAttribute('data-max-instances', config.maxInstances);
                    }

                    // Merge toolbox label into node data so dropped blocks inherit it
                    const nodeData = { ...(config.data || {}) };
                    if (config.label && !nodeData.label) {
                        nodeData.label = config.label;
                    }
                    // Store toolbox ID in node data for removal tracking
                    nodeData._toolboxId = toolboxId;
                    item.setAttribute('data-node-data', JSON.stringify(nodeData));

                    toolboxContent.appendChild(item);
                });
            }
        }

        // Bind drag events (works for both auto-generated and hardcoded items)
        const dragItems = document.querySelectorAll('.drag-item');
        dragItems.forEach(item => {
            item.addEventListener('dragstart', event => {
                event.dataTransfer.setData('node', event.target.getAttribute('data-node'));
                const nodeData = event.target.getAttribute('data-node-data');
                if (nodeData) {
                    event.dataTransfer.setData('node-data', nodeData);
                }
                event.dataTransfer.setData('toolbox-id', event.target.getAttribute('data-toolbox-id') || '');
            });
        });

        this.drawflowContainer.addEventListener('drop', (event) => this.handleDrop(event));
        this.drawflowContainer.addEventListener('dragover', event => {
            event.preventDefault();
        });

        // Restore toolbox items when nodes are removed
        this.editor.on('nodeRemoved', () => this.refreshToolboxVisibility());
    }

    //////////////////
    // Handle Drop  //
    //////////////////
    handleDrop(event) {
        event.preventDefault();
        const type = event.dataTransfer.getData('node');

        const { x, y } = this.editor.precanvas.getBoundingClientRect();
        const posX = event.clientX - x - 40;
        const posY = event.clientY - y - 40;

        let data = {};
        const nodeDataStr = event.dataTransfer.getData('node-data');
        if (nodeDataStr) {
            try { data = JSON.parse(nodeDataStr); }
            catch (e) { console.warn('Failed to parse toolbox node data:', e); }
        }

        this.addNode(type, posX, posY, data);

        // Hide toolbox item if maxInstances limit reached
        this.refreshToolboxVisibility();
    }

    //////////////////////////////////
    // Toolbox maxInstances Support //
    //////////////////////////////////
    refreshToolboxVisibility() {
        const toolboxItems = document.querySelectorAll('.drag-item[data-max-instances]');
        if (toolboxItems.length === 0) return;

        // Count canvas nodes per toolbox ID
        const canvasCounts = {};
        const flowData = this.editor.export();
        const nodes = flowData?.drawflow?.Home?.data || {};
        for (const id in nodes) {
            const tbId = nodes[id].data?._toolboxId;
            if (tbId) {
                canvasCounts[tbId] = (canvasCounts[tbId] || 0) + 1;
            }
        }

        toolboxItems.forEach(item => {
            const tbId = item.getAttribute('data-toolbox-id');
            const max = parseInt(item.getAttribute('data-max-instances'), 10);
            const count = canvasCounts[tbId] || 0;
            item.style.display = count >= max ? 'none' : '';
        });
    }

    ///////////////////////////////
    // Log Node Scheme For Debug //
    ///////////////////////////////
    logNodeScheme() {
        const flowData = this.editor.export();
        console.log("Node Scheme:", JSON.stringify(flowData, null, 2));
    }

    /////////////////////////
    // Export Node Scheme  //
    ////////////////////////
    exportNodeScheme() {
        try {
            // Get the current flow data
            const flowData = this.editor.export();
            
            // Create a timestamp for the filename
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const filename = `control-loop-${timestamp}.json`;
            
            // Convert to JSON string
            const jsonData = JSON.stringify(flowData, null, 2);
            
            // Create a blob and download link
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            // Create temporary link and trigger download
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = filename;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            
            // Cleanup
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
            
            // Optional: Show success message
            console.log('Model exported successfully:', filename);
            
        } catch (error) {
            console.error('Error exporting model:', error);
            alert('Failed to export model. Please check the console for details.');
        }
    }

    ////////////////////////
    // Import Node Scheme //
    ////////////////////////
    importNodeScheme() {
        // Create file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        
        // Handle file selection
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            
            if (!file) {
                return;
            }
            
            // Validate file type
            if (!file.name.endsWith('.json')) {
                alert('Please select a valid JSON file');
                return;
            }
            
            // Read the file
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    // Parse the JSON data
                    const flowData = JSON.parse(e.target.result);
                    
                    // Validate the data structure
                    if (!this.validateFlowData(flowData)) {
                        alert('Invalid flow data format. Please select a valid control loop file.');
                        return;
                    }
                    
                    // Clear current editor
                    this.editor.clear();
                    
                    // Import the data
                    this.editor.import(flowData);
                    
                    // Optional: Show success message
                    console.log('Model imported successfully');
                    
                } catch (error) {
                    console.error('Error importing model:', error);
                    alert('Failed to import model. Please ensure the file is a valid control loop configuration.');
                }
            };
            
            reader.onerror = function() {
                alert('Error reading file. Please try again.');
            };
            
            // Read the file as text
            reader.readAsText(file);
        });
        
        // Trigger file selection dialog
        fileInput.click();
    }

    /////////////////////////
    // Validate Flow Data  //
    /////////////////////////
    validateFlowData(data) {
        // Basic validation to ensure the data has the expected structure
        if (!data || typeof data !== 'object') {
            return false;
        }
        
        // Check for required drawflow properties
        if (!data.drawflow || typeof data.drawflow !== 'object') {
            return false;
        }
        
        // Check if it has at least one module (usually 'Home')
        const modules = Object.keys(data.drawflow);
        if (modules.length === 0) {
            return false;
        }
        
        // Validate first module structure
        const firstModule = data.drawflow[modules[0]];
        if (!firstModule.data || typeof firstModule.data !== 'object') {
            return false;
        }
        
        return true;
    }

    /////////////////////
    // Public Methods  //
    /////////////////////
    
    // Get editor instance
    getEditor() {
        return this.editor;
    }
    
    // Get current flow data
    getFlowData() {
        return this.editor.export();
    }
    
    // Clear all nodes
    clearAll() {
        this.editor.clear();
    }
    
    // Remove selected node
    removeSelected() {
        this.editor.removeNodeId('node-selected');
    }
}