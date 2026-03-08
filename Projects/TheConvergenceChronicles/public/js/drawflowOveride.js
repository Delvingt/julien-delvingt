class Drawflowoverride extends Drawflow {

    // Call the parent class constructor
    constructor(container) {
        super(container);
    }


    /////////////////
    // Delete Node //
    /////////////////
    removeNodeId(id) {
        const nodeId = id.slice(5);
        const moduleName = this.getModuleFromNodeId(nodeId);
        const nodeData = this.drawflow.drawflow[moduleName].data[nodeId];

        if (nodeData?.data?.erasable === false) {
        return;
        }
        document.getElementById(id).remove();
        delete this.drawflow.drawflow[moduleName].data[nodeId];
        this.dispatch('nodeRemoved', nodeId);
        this.removeConnectionNodeId(id);
    }
}