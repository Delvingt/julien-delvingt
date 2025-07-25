class processResults {
  constructor( {dt = 0.1, T = 10} ) {
    // Class Instances
    this.laplaceParser = new LaplaceParser();

    // Chart instances
    this.processOutputChart = null;
    this.processInputChart = null;

    // Simulation Parameters
    this.dt = dt;
    this.T = T;

    // Digital Filters
    this.digitalFilters = {}; // Store digital filters for each Laplace block
    
    // Simulation data storage
    this.simulationData = {
      timeData: [],
      setPointData: [],
      outputData: [],
      inputData: []
    };

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
        animation: true,
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
        animation: true,
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
    this.processOutputChart.data.labels = timeData;
    this.processOutputChart.data.datasets[0].data = setpointData;
    this.processOutputChart.data.datasets[1].data = outputData;
    this.processOutputChart.options.scales.y.min = Math.min(Math.min(...outputData) * 1.2, 0);
    this.processOutputChart.options.scales.y.max = Math.max(Math.max(...outputData) * 1.2, setpointData[0] * 1.2);
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
      if (node.name === "setpoint") {
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

        switch (node_class) {
          case "constant":
            signals[id][t] = value;
            break;

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
        }
      }
    }

    // Find the process node to get outputData
    const processId = Object.keys(nodes).find(id => nodes[id].name === "process");

    // outputData is the signal from the process node
    const outputData = signals[processId];

    // Create setpoint data array using the actual setpoint value
    const setpointId = Object.keys(nodes).find(id => nodes[id].name === "setpoint");
    const setpointValue = setpointId ? this.getNodeValue(setpointId, nodes[setpointId]) : 1;
    const setpointData = Array(steps).fill(setpointValue);

    // Find the control signal (input to the process)
    let inputData = null;
    if (processId && inputsMap[processId] && inputsMap[processId].length > 0) {
      // Get the signal that feeds into the process
      const controllerNodeId = inputsMap[processId][0];
      inputData = signals[controllerNodeId];
    }

    // Store simulation data
    this.simulationData = {
      timeData: timeData,
      setPointData: setpointData,
      outputData: outputData,
      inputData: inputData
    };

    // Update the chart with outputData
    this.updateCharts(timeData, setpointData, outputData, inputData);

    // Update simulation results with proper data
    this.updateSimulationResults(timeData, setpointData[0], outputData, inputData);

    // Analytics
      Analytics.trackEvent('simulation', { 
        category: 'The Convergence Chronicles',
        label: 'Simulator Run'
    });
  }

  // Helper function to get the current value from a node's input field
  getNodeValue(nodeId, node) {
  // Find the actual DOM element for this node
  const nodeElement = document.getElementById(`node-${nodeId}`);
  if (nodeElement) {
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

    for (let i = 1; i < responseTime / dt; i++) {
      const avgInput = (inputData[i] + inputData[i - 1]) / 2;
      energy += avgInput * avgInput * dt;
    }

    return energy;
  }


  /**
   * Export Data to CSV
   */
  exportData() {
    const timeData = [...this.simulationData.timeData];
    const setPointData = this.simulationData.setPointData;
    const outputData = [...this.simulationData.outputData];
    const inputData = this.simulationData.inputData ? [...this.simulationData.inputData] : null;

    // Validate that all arrays exist and have the same length
    if (!timeData || !setPointData || !outputData || !inputData) {
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