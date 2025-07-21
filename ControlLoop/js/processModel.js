class ProcessModel {
    constructor({containerId = "drawflow", setPointNode = [true, 1], processNode = [true, "1/(s+1)"] }) {
        // Parameters
        this.editor = null;
        this.drawflowContainer = document.getElementById(containerId);
        this.setPointNode = setPointNode;                                           // [Add as default, Value, Readonly]
        this.processNode = processNode;                                             // [Add as default, Expression, , Readonly]
        
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
        let html;
        // Setpoint block (upper-left)
        if (this.setPointNode[0]){
        let html = `<div>
        <div class="node-Title">Set Point</div>
            <input type="number" value="${this.setPointNode[1]}" step="0.1" min="0" max="10" ${this.setPointNode[2] ? 'readonly' : ''} />
        </div>`;
        this.editor.addNode("setpoint", 0, 1, 50, 50, "constant", {erasable: false}, html);
        }

        // Process block (upper-right)
        if (this.processNode[0])
        html = `
                <div>
                    <div class="node-Title">Process</div>
                    <div class="node-subTitle">H(s) =</div>
                    <input type="text" df-name="tf" value="${this.processNode[1]}" style="width: 120px" ${this.processNode[2] ? 'readonly' : ''}/>
                </div>`;
        this.editor.addNode("process", 1, 1, 800, 50, "transfer_function", {erasable: false}, html);
    }

    //////////////
    // Add Node //
    //////////////
    addNode(type, posX, posY) {
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

        this.editor.addNode(node_name, inputs, outputs, posX, posY, node_class, {}, html);
    }

    ////////////////////////
    // Drag and Drop Setup //
    ////////////////////////
    setupDragAndDrop() {
        const dragItems = document.querySelectorAll('.drag-item');

        dragItems.forEach(item => {
            item.addEventListener('dragstart', event => {
                event.dataTransfer.setData('node', event.target.getAttribute('data-node'));
            });
        });

        // Enable drop on the canvas
        this.drawflowContainer.addEventListener('drop', (event) => this.handleDrop(event));

        // Prevent default behavior for dragover
        this.drawflowContainer.addEventListener('dragover', event => {
            event.preventDefault();
        });
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

        this.addNode(type, posX, posY);
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