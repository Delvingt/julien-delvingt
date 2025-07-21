///////////////
// instances //
///////////////
let model;
let results;

///////////////////////////////
// Level Specific Parameters //
///////////////////////////////
const simulationParameters = {
  dt: 0.1,                                // dt [s]
  T:  10                                  // T [s]
};
const modelParameters = {
  containerId: "drawflow",                // ID of drawflow element in HTML
  setPointNode: [true, 1, true],          // Set Point Node [Add as default, Value, Readonly]
  processNode: [true, "1/(s+1)", true]    // Process Node [Add as default, Expression, , Readonly]
}

//////////////////////
// DOMContentLoaded //
//////////////////////
window.addEventListener("DOMContentLoaded", () => {

  // Create instances
  model = new ProcessModel(modelParameters)
  results = new processResults(simulationParameters);

});


