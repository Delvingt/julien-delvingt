///////////////
// instances //
///////////////
let model;
let results;

///////////////////////////////
// Level Specific Parameters //
///////////////////////////////

// Get level config if available
function getLevelConfig() {
  // Check if we're on a level page with LevelConfig
  if (typeof LevelConfig !== 'undefined' && typeof LEVEL_CONFIG !== 'undefined') {
    return LevelConfig.get(LEVEL_CONFIG.id);
  }
  return null;
}

// Default parameters (used when no level config is available)
const defaultSimulationParameters = {
  dt: 0.1,                                // dt [s]
  T:  10                                  // T [s]
};

const defaultModelParameters = {
  containerId: "drawflow",                // ID of drawflow element in HTML
  setPointNode: [true, 1, true],          // Set Point Node [Add as default, Value, Readonly]
  processNode: [true, "1/(s+1)", true]    // Process Node [Add as default, Expression, , Readonly]
};

//////////////////////
// DOMContentLoaded //
//////////////////////
window.addEventListener("DOMContentLoaded", () => {
  const levelConfig = getLevelConfig();

  // Determine parameters based on level config
  let simulationParameters;
  let modelParameters;

  if (levelConfig && levelConfig.simulationMode === 'instantaneous') {
    // Instantaneous mode - simple valve level
    simulationParameters = {
      dt: 0.1,
      T: 1,
      mode: 'instantaneous',
      levelConfig: levelConfig
    };
    modelParameters = {
      containerId: "drawflow",
      setPointNode: [false, 0, true],       // Don't add setpoint node
      processNode: [false, "", true],        // Don't add process node
      levelConfig: levelConfig
    };
  } else if (levelConfig && levelConfig.simulationMode === 'dynamic') {
    // Dynamic mode with level config — no default setpoint/process nodes
    simulationParameters = {
      dt: levelConfig.dt || 0.1,
      T: levelConfig.T || 10,
      mode: 'dynamic',
      levelConfig: levelConfig
    };
    modelParameters = {
      containerId: "drawflow",
      setPointNode: [false, 0, true],
      processNode: [false, "", true],
      levelConfig: levelConfig
    };
  } else {
    // Default dynamic mode (legacy/sandbox)
    simulationParameters = { ...defaultSimulationParameters };
    modelParameters = { ...defaultModelParameters };
  }

  // Create instances
  model = new ProcessModel(modelParameters);
  results = new processResults(simulationParameters);

  // Expose to window for access from level scripts
  window.model = model;
  window.results = results;

  // Call level initialization if defined
  if (typeof initializeLevel === 'function') {
    initializeLevel();
  }
});


