class processResults {
  constructor( {dt = 0.1, T = 10, mode = 'dynamic', levelConfig = null} ) {
    // Class Instances
    this.laplaceParser = new LaplaceParser();

    // Chart instances
    this.processOutputChart = null;
    this.processInputChart = null;

    // Simulation Parameters
    this.dt = dt;
    this.T = T;
    this.mode = mode; // 'dynamic' | 'instantaneous'
    this.levelConfig = levelConfig; // Level-specific configuration

    // Digital Filters
    this.digitalFilters = {}; // Store digital filters for each Laplace block

    // Simulation data storage
    this.simulationData = {
      timeData: [],
      setPointData: [],
      outputData: [],
      inputData: []
    };

    // Instantaneous simulation results (for non-dynamic levels)
    this.instantaneousResults = {};

    this.init()
  }

  ///////////////////
  // Initialize    //
  ///////////////////
  init(){
    this.initCharts();
  }

  ////////////////
  // Init Chart //
  ////////////////
  initCharts() {
    const ctx1 = document.getElementById("processOutputChart").getContext("2d");
    this.processOutputChart = new Chart(ctx1, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Setpoint",
            data: [],
            borderColor: "green",
            borderDash: [5, 5],
            fill: false
          },
          {
            label: "Process Output",
            data: [],
            borderColor: "red",
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        animation: false,
        plugins: {
          title: {
            display: true,
            text: 'Process Response',
            padding: {
              top: 10,
              bottom: 30
            },
            font: {
              size: 20,
              weight: '600',
              family: "'Inter', 'Helvetica Neue', Arial, sans-serif"
            },
            color: '#333333'
          },
          subtitle: {
            display: false,
            text: 'Real-time Process Simulation',
            padding: {
              bottom: 20
            },
            font: {
              size: 14,
              weight: 'normal',
              family: "'Inter', 'Helvetica Neue', Arial, sans-serif",
              style: 'italic'
            },
            color: '#666666'
          },
          legend: {
            position: 'top',
            labels: {
              padding: 15,
              font: {
                size: 12
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Time (s)",
              font: {
                size: 14,
                weight: '500'
              }
            }
          },
          y: {
            title: {
              display: true,
              text: "Process Output",
              font: {
                size: 14,
                weight: '500'
              }
            },
            min: 0,
            max: 2
          }
        }
      }
    });

    const ctx2 = document.getElementById("processInputChart").getContext("2d");
    this.processInputChart = new Chart(ctx2, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Process Input",
            data: [],
            borderColor: "blue",
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        animation: false,
        plugins: {
          title: {
            display: true,
            text: 'Control Effort',
            padding: {
              top: 10,
              bottom: 30
            },
            font: {
              size: 20,
              weight: '600',
              family: "'Inter', 'Helvetica Neue', Arial, sans-serif"
            },
            color: '#333333'
          },
          subtitle: {
            display: false,
            text: 'Real-time Process Simulation',
            padding: {
              bottom: 20
            },
            font: {
              size: 14,
              weight: 'normal',
              family: "'Inter', 'Helvetica Neue', Arial, sans-serif",
              style: 'italic'
            },
            color: '#666666'
          },
          legend: {
            position: 'top',
            labels: {
              padding: 15,
              font: {
                size: 12
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Time (s)",
              font: {
                size: 14,
                weight: '500'
              }
            }
          },
          y: {
            title: {
              display: true,
              text: "Process Input",
              font: {
                size: 14,
                weight: '500'
              }
            },
            min: 0,
            max: 2
          }
        }
      }
    });
  }

  //////////////////
  // Update Chart //
  //////////////////
  updateCharts(timeData, setpointData, outputData, inputData) {
    if (!outputData || !timeData) return;
    if (!inputData) inputData = Array(timeData.length).fill(0);

    this.processOutputChart.data.labels = timeData;
    this.processOutputChart.data.datasets[1].data = outputData;
    this.processOutputChart.options.scales.y.min = Math.min(Math.min(...outputData) * 1.2, 0);

    if (setpointData) {
      this.processOutputChart.data.datasets[0].data = setpointData;
      this.processOutputChart.data.datasets[0].hidden = false;
      this.processOutputChart.options.scales.y.max = Math.max(Math.max(...outputData) * 1.2, setpointData[0] * 1.2);
    } else {
      this.processOutputChart.data.datasets[0].data = [];
      this.processOutputChart.data.datasets[0].hidden = true;
      this.processOutputChart.options.scales.y.max = Math.max(...outputData) * 1.2;
    }

    this.processOutputChart.update('active');

    this.processInputChart.data.labels = timeData;
    this.processInputChart.data.datasets[0].data = inputData;
    this.processInputChart.options.scales.y.min = Math.min(Math.min(...inputData) * 1.2, 0);
    this.processInputChart.options.scales.y.max = Math.max(...inputData) * 1.2;
    this.processInputChart.update('active');
  }

  //////////////
  // Simulate //
  //////////////

  /**
   * Main simulation entry point - routes to appropriate simulation mode
   */
  simulate() {
    if (this.mode === 'instantaneous') {
      return this.simulateInstantaneous();
    }
    return this.simulateModel(); // Existing dynamic simulation
  }

  /**
   * Instantaneous simulation - single-step calculation with no time evolution
   * Used for static input-output relationships (e.g., valve position → flow)
   */
  simulateInstantaneous() {
    const flow = model.getFlowData();
    const nodes = flow.drawflow.Home.data;

    // Build input map for traversal
    const inputsMap = {};
    const signals = {};

    for (const id in nodes) {
      signals[id] = 0;
      for (const input in nodes[id].inputs) {
        for (const conn of nodes[id].inputs[input].connections) {
          inputsMap[id] = inputsMap[id] || [];
          inputsMap[id].push(conn.node);
        }
      }
    }

    // Topological sort
    const visited = new Set();
    const order = [];

    function visit(id) {
      if (visited.has(id)) return;
      visited.add(id);
      (inputsMap[id] || []).forEach(visit);
      order.push(id);
    }

    Object.keys(nodes).forEach(visit);

    // Single-pass calculation
    for (const id of order) {
      const node = nodes[id];
      const nodeClass = node.class;
      const value = this.getNodeValue(id, node);

      // Get input values
      const inputs = (inputsMap[id] || []).map(inputId => signals[inputId]);

      // Determine block role from BlockRegistry
      const blockConfig = BlockRegistry.get(nodeClass);
      const numInputs = blockConfig ? blockConfig.inputs : Object.keys(node.inputs).length;

      if (numInputs === 0) {
        // SOURCE block — read its value (constant, slider, setpoint, etc.)
        signals[id] = value;
      } else {
        // PROCESSING or SINK block
        switch (nodeClass) {
          case 'gain':
            signals[id] = value * (inputs[0] || 0);
            break;
          case 'add':
            signals[id] = (inputs[0] || 0) + (inputs[1] || 0);
            break;
          case 'sub':
            signals[id] = (inputs[0] || 0) - (inputs[1] || 0);
            break;
          default:
            // Sink blocks and unknown blocks: pass through
            signals[id] = inputs[0] || 0;
        }
      }
    }

    // Find output node — any sink node (0 outputs) or named 'process'
    const outputId = Object.keys(nodes).find(id => {
      const bc = BlockRegistry.get(nodes[id].class);
      return (bc && bc.outputs === 0) || nodes[id].name === 'process';
    });

    const outputValue = outputId ? signals[outputId] : 0;

    // Store results
    this.instantaneousResults = {
      output: outputValue,
      flow: outputValue
    };

    // Update charts with single-point data (show as flat line)
    const timeData = [0, 1];
    const outputData = [outputValue, outputValue];

    // Detect setpoint from a dedicated setpoint block on the canvas
    const setpointNodeId = Object.keys(nodes).find(id => nodes[id].class === 'setpoint');
    let setpointData;
    if (setpointNodeId) {
      const setpointValue = this.getNodeValue(setpointNodeId, nodes[setpointNodeId]);
      setpointData = [setpointValue, setpointValue];
    } else {
      setpointData = null;
    }

    const inputData = [outputValue, outputValue];

    this.simulationData = {
      timeData,
      setPointData: setpointData ?? [],
      outputData,
      inputData
    };

    this.updateCharts(timeData, setpointData, outputData, inputData);
    this.updateInstantaneousResults(outputValue, setpointData ? setpointData[0] : null);

    // Analytics
    Analytics.trackEvent('simulation', {
      category: 'The Convergence Chronicles',
      label: 'Instantaneous Simulation Run'
    });

    return this.instantaneousResults;
  }

  /**
   * Update display for instantaneous simulation results
   */
  updateInstantaneousResults(output, target) {
    if (target === null || target === undefined) {
      this.displayResult('responseTime', 0, 's');
      this.displayResult('overshoot', 0, '%');
      this.displayResult('maxPower', output, 'units');
      this.displayResult('inputEnergyToSettle', null, '%');
      return;
    }

    // Calculate error from target
    const error = Math.abs(output - target);
    const errorPercent = target !== 0 ? (error / target) * 100 : 0;

    // Update result displays (reuse existing elements where possible)
    this.displayResult('responseTime', 0, 's'); // Instantaneous = 0 response time
    this.displayResult('overshoot', 0, '%'); // No overshoot in instantaneous mode
    this.displayResult('maxPower', output, 'units');
    this.displayResult('inputEnergyToSettle', errorPercent, '%');
  }

  simulateModel() {
    const flow = model.getFlowData();
    const nodes = flow.drawflow.Home.data;

    const dt = this.dt;
    const T = this.T;
    const steps = Math.floor(T / dt);
    const timeData = Array.from({ length: steps }, (_, i) => Math.round(i * dt * 10) / 10);

    const signals = {};
    const integratorState = {};
    const derivativeState = {}; // Store previous values for derivative blocks
    const inputsMap = {};

    // Initialize signals and input map
    for (const id in nodes) {

      signals[id] = Array(steps).fill(0);
      
      if (nodes[id].class === "integrator") {
        integratorState[id] = 0;
      }
      if (nodes[id].class === "derivative") {
        derivativeState[id] = undefined;
      }
      if (nodes[id].class === "transfer_function") {
        const tfString = this.getNodeValue(id, nodes[id]);
        try {
          const { num, den } = this.laplaceParser.parseLaplaceTransform(tfString);
          const { numZ, denZ } = this.laplaceParser.continuousToDiscrete(num, den, dt);
          this.digitalFilters[id] = this.laplaceParser.createDigitalFilter(numZ, denZ);
        } catch (e) {
          console.error(`Error parsing transfer function for node ${id}:`, e);
          this.digitalFilters[id] = (input) => input; // Pass through on error
        }
      }

      for (const input in nodes[id].inputs) {
        for (const conn of nodes[id].inputs[input].connections) {
          inputsMap[id] = inputsMap[id] || [];
          inputsMap[id].push(conn.node);
        }
      }
    }

    // Topological sort
    const visited = new Set();
    const order = [];

    function visit(id) {
      if (visited.has(id)) return;
      visited.add(id);
      (inputsMap[id] || []).forEach(visit);
      order.push(id);
    }

    Object.keys(nodes).forEach(visit);

    // Initialize first timestep (t=0) for source nodes
    for (const id of order) {
      const node = nodes[id];
      const bc = BlockRegistry.get(node.class);
      const ni = bc ? bc.inputs : Object.keys(node.inputs).length;
      if (ni === 0) {
        signals[id][0] = this.getNodeValue(id, node);
      }
    }

    // Simulate
    for (let t = 1; t < steps; t++) {
      for (const id of order) {
        const node = nodes[id];
        const node_class = node.class;
        const value = this.getNodeValue(id, node);

        // Set Block inputs
        const inputs = (inputsMap[id] || []).map(inputId => {
          // For integral and derivative calculation set input on previous value
          if (node_class === "derivative" || node_class === "process" || node_class === "integrator"
              || node_class === "transfer_function") {
            return signals[inputId][t - 1];
          }
          // For algebraic blocks, use current timestep if available, else previous
          return signals[inputId][t] !== 0 ? signals[inputId][t] : signals[inputId][t - 1];
        });

        // Determine block role from BlockRegistry
        const blockConfig = BlockRegistry.get(node_class);
        const numInputs = blockConfig ? blockConfig.inputs : Object.keys(node.inputs).length;

        if (numInputs === 0) {
          // SOURCE block — read its value
          signals[id][t] = value;
        } else {
          switch (node_class) {
            case "sub":
              signals[id][t] = (inputs[0] || 0) - (inputs[1] || 0);
              break;

            case "add":
              signals[id][t] = (inputs[0] || 0) + (inputs[1] || 0);
              break;

            case "gain":
              signals[id][t] = value * (inputs[0] || 0);
              break;

            case "integrator":
              // Integrator needs the current input value
              const currentInput = (inputsMap[id] || []).map(inputId =>
                signals[inputId][t] !== 0 ? signals[inputId][t] : signals[inputId][t - 1]
              )[0] || 0;
              integratorState[id] += currentInput * dt;
              signals[id][t] = integratorState[id];
              break;

            case "derivative":
              const derivInput = inputs[0] || 0;
              if (derivativeState[id] !== undefined) {
                const derivative = value * (derivInput - derivativeState[id]) / dt;
                signals[id][t] = derivative;
              } else {
                // First iteration - no previous value, so derivative is 0
                signals[id][t] = 0;
              }
              derivativeState[id] = derivInput;
              break;
            case "transfer_function":
              // Use the digital filter
              if (this.digitalFilters[id]) {
                signals[id][t] = this.digitalFilters[id](inputs[0] || 0);
              } else {
                signals[id][t] = inputs[0] || 0; // Pass through if no filter
              }
              break;
            default:
              // Sink blocks and unknown blocks: pass through
              signals[id][t] = inputs[0] || 0;
          }
        }
      }
    }

    // Find the process node to get outputData
    let processId = Object.keys(nodes).find(id => nodes[id].name === "process");
    if (!processId) {
      // Fallback: find last sink block (0 outputs) in execution order
      processId = [...order].reverse().find(id => {
        const bc = BlockRegistry.get(nodes[id].class);
        const numOutputs = bc ? bc.outputs : Object.keys(nodes[id].outputs).length;
        return numOutputs === 0;
      });
    }
    // If still no sink, use the last node in execution order
    if (!processId) {
      processId = order[order.length - 1];
    }
    const outputData = signals[processId] || Array(steps).fill(0);

    // Detect setpoint from a dedicated setpoint block on the canvas
    const setpointNodeId = Object.keys(nodes).find(id => nodes[id].class === 'setpoint');
    let setpointData;
    if (setpointNodeId) {
      const setpointValue = this.getNodeValue(setpointNodeId, nodes[setpointNodeId]);
      setpointData = Array(steps).fill(setpointValue);
    } else {
      setpointData = null;
    }

    // Find the control signal (input to the process/output node)
    let inputData = null;
    if (processId && inputsMap[processId] && inputsMap[processId].length > 0) {
      const controllerNodeId = inputsMap[processId][0];
      inputData = signals[controllerNodeId];
    }
    if (!inputData) {
      inputData = Array(steps).fill(0);
    }

    // Store simulation data
    this.simulationData = {
      timeData: timeData,
      setPointData: setpointData ?? [],
      outputData: outputData,
      inputData: inputData
    };

    // Update the chart with outputData
    this.updateCharts(timeData, setpointData, outputData, inputData);

    // Update simulation results with proper data
    this.updateSimulationResults(timeData, setpointData ? setpointData[0] : null, outputData, inputData);

    // Analytics
      Analytics.trackEvent('simulation', {
        category: 'The Convergence Chronicles',
        label: 'Simulator Run'
    });

    return this.simulationData;
  }

  // Helper function to get the current value from a node's input field
  getNodeValue(nodeId, node) {
  // Find the actual DOM element for this node
  const nodeElement = document.getElementById(`node-${nodeId}`);
  if (nodeElement) {
    // Use BlockRegistry getValue if available
    if (BlockRegistry.has(node.class)) {
      const blockConfig = BlockRegistry.get(node.class);
      if (blockConfig.getValue) {
        return blockConfig.getValue(nodeElement);
      }
    }
    // Check if it's a transfer function node
    if (node.class === "transfer_function") {
      // Look for a text input for transfer functions
      const inputElement = nodeElement.querySelector('input[type="text"]');
      if (inputElement) {
        return inputElement.value || "1/s"; // Default transfer function
      }
    } else {
      // For other nodes (gain, sum, etc.), look for number input
      const inputElement = nodeElement.querySelector('input[type="number"]');
      if (inputElement) {
        return parseFloat(inputElement.value) || 0;
      }
    }
  }

  // Fallback to parsing the HTML template
  if (node.class === "transfer_function") {
    // For transfer function, look for text value
    const match = node.html.match(/value="([^"]+)"/);
    return match ? match[1] : "1/s";
  } else {
    // For numeric nodes
    const match = node.html.match(/value="([\d.-]+)"/);
    return match ? parseFloat(match[1]) : 0;
  }
}

  /**
   * Calculate simulation metrics and update the results display
   */
  updateSimulationResults(timeData, setPoint, outputData, inputData = null) {
    if (setPoint === null || setPoint === undefined) {
      this.displayResult('responseTime', null, 's');
      this.displayResult('overshoot', null, '%');
      this.displayResult('maxPower', this.calculateMaxPower(inputData), 'W');
      this.displayResult('inputEnergyToSettle', null, 'J');
      return;
    }

    // Calculate metrics
    const responseTime = this.calculateResponseTime(timeData, setPoint, outputData);
    const overshoot = this.calculateOvershoot(setPoint, outputData);
    const maxPower = this.calculateMaxPower(inputData);
    const inputEnergyToSettle = inputData ? this.calculateInputEnergyToSettle(timeData, inputData, responseTime) : null;

    // Update display
    this.displayResult('responseTime', responseTime, 's');
    this.displayResult('overshoot', overshoot, '%');
    this.displayResult('maxPower', maxPower, 'W');
    this.displayResult('inputEnergyToSettle', inputEnergyToSettle, 'J');
  }

  /**
   * Display a result value with animation
   */
  displayResult(elementId, value, unit) {
    const element = document.getElementById(elementId);
    if (!element) return;

    if (value === null || value === undefined) {
      element.textContent = '--';
      return;
    }

    // Format the value
    let formattedValue;
    if (value < 0.01 && value > 0) {
      formattedValue = value.toExponential(2);
    } else if (value < 10) {
      formattedValue = value.toFixed(3);
    } else if (value < 100) {
      formattedValue = value.toFixed(2);
    } else {
      formattedValue = value.toFixed(1);
    }

    element.textContent = `${formattedValue} ${unit}`;

    // Add animation class
    element.classList.add('updated');
    setTimeout(() => {
      element.classList.remove('updated');
    }, 500);
  }

  /**
   * Calculate response time (time to reach 90% of steady state)
   */
  calculateResponseTime(timeData, setPoint, outputData) {
    if (!outputData || outputData.length === 0) return null;

    const minThreshold = setPoint * 0.95;
    const maxThreshold = setPoint * 1.05;
    const consecutiveInTarget = 10;
    let currentInTarget = 0;

    for (let i = 0; i < outputData.length; i++) {
      if (outputData[i] >= minThreshold && outputData[i] <= maxThreshold) {
        currentInTarget++;
        if (currentInTarget === consecutiveInTarget) {
          return timeData[i - consecutiveInTarget + 1];
        }
      } else {
        currentInTarget = 0;
      }
    }

    return Infinity;
  }

  /**
   * Calculate percentage overshoot
   */
  calculateOvershoot(setPoint, outputData) {
    if (!outputData || outputData.length === 0) return null;

    const maxValue = Math.max(...outputData);
    const overshoot = ((maxValue - setPoint) / setPoint) * 100;

    return Math.max(0, overshoot);
  }

  /**
   * Calculate max Power
   */
  calculateMaxPower(inputData) {
    if (!inputData || inputData.length === 0) return null;

    let power = 0;
    let maxPower = 0;

    for (let i = 1; i < inputData.length; i++) {
      power = inputData[i];
      if (power > maxPower) {
        maxPower = power;
      }
    }

    return maxPower;
  }

  /**
   * Calculate input energy (integral of input squared)
   */
  calculateInputEnergyToSettle(timeData, inputData, responseTime) {
    if (responseTime === Infinity) return Infinity;
    if (!inputData || inputData.length === 0 || !timeData || timeData.length === 0) return null;

    let energy = 0;
    const dt = this.dt;

    const maxIndex = Math.min(Math.ceil(responseTime / dt), inputData.length);
    for (let i = 1; i < maxIndex; i++) {
      const avgInput = (inputData[i] + inputData[i - 1]) / 2;
      energy += avgInput * avgInput * dt;
    }

    return energy;
  }


  /**
   * Extract a flat metrics object from current simulation data.
   * @param {number} [sinkValue] - Optional instantaneous sink value
   * @returns {object} Metrics object with finalValue, sinkValue, overshoot, etc.
   */
  extractMetrics(sinkValue) {
    const output = this.simulationData?.outputData || [];
    const input  = this.simulationData?.inputData || [];
    const time   = this.simulationData?.timeData || [];
    const setpoint = this.simulationData?.setPointData?.[0] ?? 0;
    const dt = this.dt;

    const responseTime = this.calculateResponseTime(time, setpoint, output);
    const overshoot    = this.calculateOvershoot(setpoint, output);
    const maxPower     = this.calculateMaxPower(input);
    const inputEnergy  = input.length > 0
        ? this.calculateInputEnergyToSettle(time, input, responseTime)
        : null;

    return {
        sinkValue:    sinkValue ?? (output.length > 0 ? output[output.length - 1] : 0),
        finalValue:   output.length > 0 ? output[output.length - 1] : (sinkValue ?? 0),
        setpoint,
        outputAtTime: (t) => output[Math.floor(t / dt)] ?? 0,
        overshoot,
        responseTime,
        maxPower,
        inputEnergy,
    };
  }

  /**
   * Evaluate a single criterion against metrics.
   * @param {object} criterion - Criterion object with type/metric/target or check function
   * @param {object} metrics - Metrics object from extractMetrics()
   * @returns {boolean} Whether the criterion passes
   */
  evaluateCriterion(criterion, metrics) {
    if (typeof criterion.check === 'function') {
        return criterion.check(metrics);
    }

    let actual = metrics[criterion.metric];
    if (typeof actual === 'function') {
        actual = actual(criterion.time);
    }
    if (actual === null || actual === undefined) return false;

    const CHECKS = {
        gte:     (a, t) => a >= t,
        lte:     (a, t) => a <= t,
        gt:      (a, t) => a > t,
        lt:      (a, t) => a < t,
        closeTo: (a, t, tol) => Math.abs(a - t) <= (tol ?? 0.01),
    };

    const fn = CHECKS[criterion.type];
    if (!fn) {
        console.warn(`Unknown criterion type: "${criterion.type}"`);
        return false;
    }
    return fn(actual, criterion.target, criterion.tolerance);
  }

  /**
   * Check all criteria against current simulation data.
   * @param {Array} criteriaArray - Array of criterion objects
   * @param {number} [sinkValue] - Optional instantaneous sink value
   * @returns {{ success: boolean, metrics: object, results: Array<{criterion, passed}> }}
   */
  checkCriteria(criteriaArray, sinkValue) {
    if (!criteriaArray || !Array.isArray(criteriaArray) || criteriaArray.length === 0) {
        return { success: true, metrics: {}, results: [] };
    }

    const metrics = this.extractMetrics(sinkValue);
    const results = criteriaArray.map(c => ({
        criterion: c,
        passed: this.evaluateCriterion(c, metrics)
    }));

    return {
        success: results.every(r => r.passed),
        metrics,
        results
    };
  }

  /**
   * Export Data to CSV
   */
  exportData() {
    const timeData = [...this.simulationData.timeData];
    const rawSetPointData = this.simulationData.setPointData;
    const setPointData = rawSetPointData && rawSetPointData.length > 0
        ? rawSetPointData
        : Array(timeData.length).fill(0);
    const outputData = [...this.simulationData.outputData];
    const inputData = this.simulationData.inputData ? [...this.simulationData.inputData] : null;

    // Validate that all arrays exist and have the same length
    if (!timeData || !outputData || !inputData) {
        console.error('Missing data arrays for export');
        alert('Error: Missing simulation data for export');
        return;
    }

    const dataLength = timeData.length;
    if (setPointData.length !== dataLength ||
        outputData.length !== dataLength ||
        inputData.length !== dataLength) {
        console.error('Data arrays have different lengths');
        alert('Error: Data arrays have inconsistent lengths');
        return;
    }

    // Create CSV content
    let csvContent = 'Time,Setpoint,Output,Input\n';
    
    // Add data rows
    for (let i = 0; i < dataLength; i++) {
        const row = [
            timeData[i],
            setPointData[i],
            outputData[i],
            inputData[i]
        ].join(',');
        csvContent += row + '\n';
    }

    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Set file name with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const fileName = `simulation_data_${timestamp}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.display = 'none';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
    
    // Optional: Show success message
    console.log(`Exported ${dataLength} data points to ${fileName}`);

    // Analytics
    Analytics.trackEvent('download', { 
      category: 'The Convergence Chronicles',
      label: "Process Results Export",
      file_type: 'json',
      value: dataLength
    });
  }

}