class Simulator {
    constructor() {
        // Form Inputs
        this.Ls = 0;
        this.ds = 0;
        this.spm = 0;
        this.Vc = 0;
        this.N = 0;
        this.x = 0;
        
        // Form optional
        this.optimal_Ls_Enable = false;
        this.optimal_ds_Enable = false;
        this.optimal_spm_Enable = false;
        this.optimal_Vc_Enable = false;

        // Form output
        this.distanceFromOptimal = 0;
        this.wavelength = 0;
        this.phaseShift = 0;
        this.signals = [];
        
        // Charts
        this.sprayerTravelChart = null;
        this.paintPatternChart = null;
        
        // Simplified spray configuration
        this.sprayConfig = {
            sprayWidth: 10,         // Width of spray cone in meters
            opacity: 0.5,           // Overall opacity of the spray
            sprayCoverage: 50,      // How quickly spray fades from center (higher = sharper)
            color: { r: 0, g: 35, b: 150 }  // Spray color
        };
        
        // Default spray config for reset
        this.defaultSprayConfig = JSON.parse(JSON.stringify(this.sprayConfig));

        this.init();
    }

    init() {
        this.initCharts();
        this.setupEventListeners();
        this.initializeSprayConfigForm();
    }

    setupEventListeners() {
        // Prevent form submission
        document.getElementById('simulationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.simulate();
        });
        
        // Simulate Button
        document.getElementById('submitForm').addEventListener('click', (e) => {
            e.preventDefault();
            this.simulate();
        });

        //Optimal Checkboxes
        const optimalCheckboxIds = ['optimal_Ls_Enable', 'optimal_ds_Enable', 'optimal_spm_Enable', 'optimal_Vc_Enable'];
        const inputMapping =       ['Ls'               , 'ds'               , 'spm'               , 'Vc'];
        optimalCheckboxIds.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.addEventListener('click', (event) => {
                    if (event.target.checked) {
                        this.singleChoiceCheckboxes(id, optimalCheckboxIds, inputMapping);
                    } else {
                        // If unchecking, enable its input
                        const index = optimalCheckboxIds.indexOf(id);
                        const inputId = inputMapping[index];
                        if (inputId) {
                            const input = document.getElementById(inputId);
                            if (input) {
                                input.disabled = false;
                            }
                        }
                    }
                });
            }
        });

        // Spray Gun Coverage
        document.getElementById('sprayCoverage').addEventListener('input', (e) => {
            this.updateSprayCoverage();
        });

        // Update Spray Config Button
        document.getElementById('updateSprayConfig').addEventListener('click', (e) => {
            e.preventDefault();
            this.simulate();
        });

        // Reset Spray Config Button
        document.getElementById('resetSprayConfig').addEventListener('click', (e) => {
            e.preventDefault();
            this.resetSprayConfig();
        });

        // Color handlers
        document.getElementById('sprayColorPicker').addEventListener('input', (e) => {
            const color = this.hexToRgb(e.target.value);
            this.sprayConfig.color = color;
            this.updateColorInputs(color);
        });
        
        ['sprayColorR', 'sprayColorG', 'sprayColorB'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                this.updateColorFromRgbInputs();
            });
        });

    }

    initCharts() {
        // Initialize Sprayer Travel Chart
        const ctx = document.getElementById("simGraphTravels").getContext("2d");
        this.sprayerTravelChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Sprayer Travel Patterns',
                        padding: { top: 10, bottom: 20 },
                        font: {
                            size: 20,
                            weight: '600'
                        },
                        color: '#333'
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 15,
                            font: { size: 12 },
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: '#333',
                        bodyColor: '#666',
                        borderColor: '#ddd',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Product Flow Path [m]",
                            font: { size: 14, weight: '500' }
                        },
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Stroke Position [m]",
                            font: { size: 14, weight: '500' }
                        },
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });

        // Initialize Paint Pattern Chart
        const ctx2 = document.getElementById("simGraphPattern").getContext("2d");
        this.paintPatternChart = new Chart(ctx2, {
            type: "line",
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Paint Coverage Pattern',
                        padding: { top: 10, bottom: 20 },
                        font: {
                            size: 20,
                            weight: '600'
                        },
                        color: '#333'
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Product Flow Path [m]",
                            font: { size: 14, weight: '500' }
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Product Width [m]",
                            font: { size: 14, weight: '500' }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                elements: {
                    line: {
                        borderWidth: 0,
                        backgroundColor: 'transparent',
                        fill: false
                    },
                    point: {
                        radius: 0
                    }
                }
            }
        });
    }

    singleChoiceCheckboxes(idClicked, checkboxIds, inputMapping = []) {
        // Loop through all checkbox IDs
        checkboxIds.forEach((id, index) => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                // Uncheck all checkboxes except the one that was clicked
                if (id !== idClicked) {
                    checkbox.checked = false;
                }
                
                // Only handle input enabling/disabling if mapping is provided
                if (inputMapping.length > 0 && inputMapping[index]) {
                    const input = document.getElementById(inputMapping[index]);
                    
                    if (input) {
                        if (checkbox.checked) {
                            // Enable the input
                            input.disabled = true;

                        } else {
                            // Disable the input
                            input.disabled = false;

                        }
                    }
                }
            }
        });
    }

    simulate() {
        this.getFormInputs();
        this.calculateSignals();
        this.updateSprayerTravelChart();
        this.updatePaintPatternChart();
        this.updateResultsDisplay();

        Analytics.trackEvent('simulation', { 
            category: 'sprayBoothSimulator',
            label: 'Simulator Run'
        });
    }

    getFormInputs() {
        this.Ls = parseFloat(document.getElementById('Ls').value);
        this.ds = parseFloat(document.getElementById('ds').value) / 100;    // Convert cm to m
        this.spm = parseFloat(document.getElementById('spm').value);
        this.Vc = parseFloat(document.getElementById('Vc').value) / 60;     // Convert m/min to m/s
        this.N = parseInt(document.getElementById('N').value);  
        this.x = parseInt(document.getElementById('x').value);

        this.optimal_Ls_Enable = document.getElementById('optimal_Ls_Enable').checked;
        this.optimal_ds_Enable = document.getElementById('optimal_ds_Enable').checked;
        this.optimal_spm_Enable = document.getElementById('optimal_spm_Enable').checked;
        this.optimal_Vc_Enable  = document.getElementById('optimal_Vc_Enable').checked;

        this.sprayConfig.sprayWidth = parseFloat(document.getElementById('sprayWidth').value);
        this.sprayConfig.opacity = parseFloat(document.getElementById('sprayOpacity').value);
        this.updateSprayCoverage();
    }

    updateSprayCoverage() {
        this.sprayConfig.sprayCoverage = parseFloat(document.getElementById('sprayCoverage').value);
        let description = "";
        if (this.sprayConfig.sprayCoverage <= 30) {
            description = "Very focused beam - Sharp edges, concentrated center";
        } else if (this.sprayConfig.sprayCoverage <= 50) {
            description = "Focused spray - Clear center with defined edges";
        } else if (this.sprayConfig.sprayCoverage <= 70) {
            description = "Balanced spray - Even distribution with soft edges";
        } else if (this.sprayConfig.sprayCoverage <= 85) {
            description = "Wide spray - Soft, diffused pattern";
        } else {
            description = "Very wide spray - Extremely soft, cloud-like pattern";
        }

        document.getElementById('patternDescription').textContent = description;
    }

    calculateSignals() {

        // --- If Stroke Ls is unknown ---
        // Ls = (Vs * T) / 2                                                    [m] Sprayer stroke amplitude (half stroke)
        // Using T = λ_opt / Vc and λ_opt = (N * ds) / (N - 1)^x:
        // Ls = (Vs / 2) * (λ_opt / Vc)
        // Ls = (Vs / 2) * ((N * ds) / (Vc * (N - 1)^x))

        // --- If Nozzle Spacing ds is unknown ---
        // λ_opt = Vc / fs = (N * ds) / (N - 1)^x 
        // ds     = (Vc / fs) * (N - 1)^x / N                                   [m] Optimal Nozzle Spacing

        // --- If Frequency fs is unknown ---
        // λ_opt = (N * ds) / (N - 1)^x
        // fs     = Vc / λ_opt                                                  [Hz] Optimal Frequency
        //        = Vc / ((N * ds) / (N - 1)^x)

        // --- If Conveyor Speed Vc is unknown ---
        // λ_opt = (N * ds) / (N - 1)^x
        // Vc     = fs * λ_opt                                                  [m/s] Optimal Conveyor Speed
        //        = fs * ((N * ds) / (N - 1)^x)

        // --- When everything is defined ---
        // Vc = 2Ls / T
        // T  = λ / Vc                                                          [s] Period
        // fs = 1 / T                                                           [Hz] Frequency
        // λ  = Vc / fs                                                         [m] Wavelength
        // φ[n] = 2π * n * ds / λ                                               [rad] Phaseshift

        let Ls = this.Ls;
        let ds = this.ds;
        let fs = 0;
        let spm = this.spm;
        let Vc = this.Vc;
        let N = this.N;
        let x = this.x;
        let lambda = 0;

        if (this.optimal_Ls_Enable) {
            lambda = (N * ds) / Math.pow(N - 1, x);
            Ls = lambda / 2;
            fs = spm/60;            
        } else if (this.optimal_ds_Enable) {
            fs = spm / 60; // Convert spm to Hz
            ds = (Vc / fs) * Math.pow(N - 1, x) / N;
            lambda = (N * ds) / Math.pow(N - 1, x);         
        } else if (this.optimal_spm_Enable) {
            lambda = (N * ds) / Math.pow(N - 1, x);
            fs = Vc / lambda;
            spm = fs * 60; // Convert Hz to strokes per minute
        } else if (this.optimal_Vc_Enable) {
            fs = spm / 60; // Convert spm to Hz
            lambda = (N * ds) / Math.pow(N - 1, x);
            Vc = fs * lambda;            
        } else {
            const lambda_opt = (N * ds) / Math.pow(N - 1, x);
            fs = spm / 60; // Convert spm to Hz
            lambda = Vc / fs;
            fs = spm/60;
            this.distanceFromOptimal = Math.round(Math.abs( lambda - lambda_opt)*100)/100;
        }

        // Update the object properties
        this.Ls = Ls;
        this.ds = ds;
        this.spm = spm;
        this.Vc = Vc;
        this.wavelength = lambda;

        // Simulation parameters
        const Tsim = 10; // Simulation time in seconds
        const dt = 0.01; // Time step
        const steps = Math.floor(Tsim / dt);

        // Clear previous signals
        this.signals = [];

        // Calculate x-axis (distance)
        const distances = Array.from({ length: steps }, (_, i) => 
            Math.round(this.Vc * i * dt * 100) / 100
        );
        this.signals.push(distances);

        // Calculate sprayer positions
        for (let n = 0; n < this.N; n++) {
            // Phase shift for each sprayer
            const phaseShift = (2 * Math.PI * n * ds) / lambda;
            
            if (n === 1) {
                this.phaseShift = phaseShift / (this.x + 1);
            }

            // Calculate travel positions
            const travelData = Array.from({ length: steps }, (_, i) => {
                const t = i * dt;
                const position = Ls / 2 + (Ls / 2) * Math.cos(2 * Math.PI * fs * t + phaseShift);
                return Math.round(position * 1000) / 1000;
            });

            this.signals.push(travelData);
        }
    }

    updateResultsDisplay() {
        // Show results section
        document.getElementById('resultsStats').style.display = 'flex';

        if (this.optimal_Ls_Enable) {
            document.getElementById('optimalSelectedLabel').textContent = 'Optimal Stroke (Ls)';
            document.getElementById('optimalSelectedValue').textContent = this.Ls ? this.Ls.toFixed(3) + ' m' : '-';           
        } else if (this.optimal_ds_Enable) {
            document.getElementById('optimalSelectedLabel').textContent = 'Optimal Spacing (ds)';
            document.getElementById('optimalSelectedValue').textContent = this.ds ? (this.ds * 100).toFixed(2) + ' cm' : '-';
        } else if (this.optimal_spm_Enable) {
            document.getElementById('optimalSelectedLabel').textContent = 'Optimal Frequency (SPM)';
            document.getElementById('optimalSelectedValue').textContent = this.spm ? this.spm.toFixed(2) + ' spm' : '-';
        } else if (this.optimal_Vc_Enable) {
            document.getElementById('optimalSelectedLabel').textContent = 'Optimal Conveyor Speed (Vc)';
            document.getElementById('optimalSelectedValue').textContent = this.Vc ? (this.Vc * 60).toFixed(2) + ' m/min' : '-';
        } else {
            document.getElementById('optimalSelectedLabel').textContent = 'Distance FromOptimal';
            document.getElementById('optimalSelectedValue').textContent = this.distanceFromOptimal;
        }
        
        // Update values
        document.getElementById('wavelength').textContent = this.wavelength ? this.wavelength.toFixed(3) + ' m' : '-';
        document.getElementById('phaseShift').textContent = this.phaseShift ? (this.phaseShift * 180 / Math.PI).toFixed(2) + '°' : '-';
    }

    updateSprayerTravelChart() {
        if (!this.signals || this.signals.length < 2) return;

        // Generate colors for sprayers
        const colors = [
            'rgb(102, 126, 234)',
            'rgb(118, 75, 162)',
            'rgb(237, 100, 166)',
            'rgb(255, 154, 0)',
            'rgb(46, 213, 137)',
            'rgb(255, 71, 87)',
            'rgb(0, 123, 255)',
            'rgb(255, 193, 7)'
        ];

        // Create datasets for each sprayer
        const datasets = [];
        for (let i = 1; i <= this.N; i++) {
            datasets.push({
                label: `Sprayer ${i}`,
                data: this.signals[i],
                borderColor: colors[(i - 1) % colors.length],
                backgroundColor: colors[(i - 1) % colors.length] + '20',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 5,
                tension: 0.4
            });
        }

        // Update chart
        this.sprayerTravelChart.data.labels = this.signals[0];
        this.sprayerTravelChart.data.datasets = datasets;
        this.sprayerTravelChart.update('resize');
    }

    updatePaintPatternChart() {
        // Get Form Input & Calibration
        this.sprayConfig.sprayWidth = this.sprayConfig.sprayWidth * 0.03;

        const gradientSlope = this.coverageToGradientSlope(this.sprayConfig.sprayCoverage);

        if (!this.signals || this.signals.length < 2) return;

        const paintDatasets = [];
        
        // Limit layers to prevent performance issues
        const numLayers = Math.min(50, Math.max(15, Math.floor(this.sprayConfig.sprayWidth * 200)));
        
        for (let i = 1; i <= this.N; i++) {
            const xData = this.signals[0];
            const yData = this.signals[i];
            
            // Create gradient spray effect
            for (let layer = 0; layer < numLayers; layer++) {
                const normalizedPosition = (layer / (numLayers - 1)) - 0.5; // -0.5 to 0.5
                const offsetDistance = normalizedPosition * this.sprayConfig.sprayWidth;
                
                // Calculate opacity
                const distance = Math.abs(normalizedPosition) * 2;
                const layerOpacity = this.sprayConfig.opacity * Math.exp(-Math.pow(distance * gradientSlope, 2));
                
                if (layerOpacity > 0.01) {
                    // Calculate offset using parametric approach
                    const offsetCurve = this.generateOffsetCurve(xData, yData, offsetDistance);
                    
                    paintDatasets.push({
                        type: 'line',
                        data: offsetCurve.map((point, idx) => ({
                            x: point.x,
                            y: point.y
                        })),
                        borderColor: `rgba(${this.sprayConfig.color.r}, ${this.sprayConfig.color.g}, ${this.sprayConfig.color.b}, ${layerOpacity})`,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 0,
                        tension: 0.4,
                        fill: false,
                        showLine: true
                    });
                }
            }
        }
        
        // Update chart with x-y data format
        this.paintPatternChart.data.datasets = paintDatasets;
        this.paintPatternChart.options.scales.x = {
            type: 'linear',
            position: 'bottom'
        };
        this.paintPatternChart.update('resize');
    }

    calculateDerivatives(xData, yData) {
        const derivatives = [];
        const n = xData.length;
        
        for (let i = 0; i < n; i++) {
            let dx, dy;
            
            if (i === 0) {
                // Forward difference for first point
                dx = xData[1] - xData[0];
                dy = yData[1] - yData[0];
            } else if (i === n - 1) {
                // Backward difference for last point
                dx = xData[n - 1] - xData[n - 2];
                dy = yData[n - 1] - yData[n - 2];
            } else {
                // Central difference for middle points
                dx = xData[i + 1] - xData[i - 1];
                dy = yData[i + 1] - yData[i - 1];
            }
            
            derivatives.push(dy / dx);
        }
        
        return derivatives;
    }

    calculatePerpendicularOffset(xData, yData, derivatives, offsetDistance) {
        const offsetX = [];
        const offsetY = [];
        
        for (let i = 0; i < xData.length; i++) {
            // Calculate normal vector (perpendicular to tangent)
            const slope = derivatives[i];
            
            // Normal vector components (perpendicular to tangent)
            // If tangent is (1, slope), normal is (-slope, 1) normalized
            const normalLength = Math.sqrt(1 + slope * slope);
            const normalX = -slope / normalLength;
            const normalY = 1 / normalLength;
            
            // Apply offset in normal direction
            offsetX.push(xData[i] + normalX * offsetDistance);
            offsetY.push(yData[i] + normalY * offsetDistance);
        }
        
    return { x: offsetX, y: offsetY };
    }

    generateOffsetCurve(xData, yData, offsetDistance) {
        const offsetPoints = [];
        const n = xData.length;
        
        for (let i = 0; i < n; i++) {
            // Calculate tangent vector using neighboring points
            let tangentX, tangentY;
            
            if (i === 0) {
                tangentX = xData[1] - xData[0];
                tangentY = yData[1] - yData[0];
            } else if (i === n - 1) {
                tangentX = xData[n - 1] - xData[n - 2];
                tangentY = yData[n - 1] - yData[n - 2];
            } else {
                // Use average of forward and backward tangents for smoother results
                const forwardX = xData[i + 1] - xData[i];
                const forwardY = yData[i + 1] - yData[i];
                const backwardX = xData[i] - xData[i - 1];
                const backwardY = yData[i] - yData[i - 1];
                
                tangentX = (forwardX + backwardX) / 2;
                tangentY = (forwardY + backwardY) / 2;
            }
            
            // Normalize tangent vector
            const tangentLength = Math.sqrt(tangentX * tangentX + tangentY * tangentY);
            tangentX /= tangentLength;
            tangentY /= tangentLength;
            
            // Calculate normal vector (rotate tangent by 90 degrees)
            const normalX = -tangentY;
            const normalY = tangentX;
            
            // Apply offset
            offsetPoints.push({
                x: xData[i] + normalX * offsetDistance,
                y: yData[i] + normalY * offsetDistance
            });
        }
        
        return offsetPoints;
    }

    updateColorInputs(color) {
        document.getElementById('sprayColorR').value = color.r;
        document.getElementById('sprayColorG').value = color.g;
        document.getElementById('sprayColorB').value = color.b;
    }

    updateColorFromRgbInputs() {
        const r = parseInt(document.getElementById('sprayColorR').value) || 0;
        const g = parseInt(document.getElementById('sprayColorG').value) || 0;
        const b = parseInt(document.getElementById('sprayColorB').value) || 0;
        
        this.sprayConfig.color = { r, g, b };
        document.getElementById('sprayColorPicker').value = this.rgbToHex(r, g, b);
    }

    resetSprayConfig() {
        // Reset to defaults
        this.sprayConfig = JSON.parse(JSON.stringify(this.defaultSprayConfig));
        
        // Update all form inputs
        document.getElementById('sprayWidth').value = this.sprayConfig.sprayWidth;
        document.getElementById('sprayOpacity').value = this.sprayConfig.opacity;
        document.getElementById('sprayCoverage').value = this.sprayConfig.sprayCoverage;
        
        // Update color
        document.getElementById('sprayColorPicker').value = this.rgbToHex(
            this.sprayConfig.color.r,
            this.sprayConfig.color.g,
            this.sprayConfig.color.b
        );
        this.updateColorInputs(this.sprayConfig.color);
    }

    coverageToGradientSlope(coveragePercent, paintPercent = 90) {
        // Ensure valid input
        coveragePercent = Math.max(10, Math.min(100, coveragePercent));
        paintPercent = Math.max(50, Math.min(99, paintPercent));
        
        // Convert percentages to fractions
        const coverageFraction = coveragePercent / 100;
        const remainingOpacity = (100 - paintPercent) / 100;
        
        // Calculate gradient slope from the relationship:
        // opacity = exp(-(distance * gradientSlope)^2)
        // Solving for gradientSlope when opacity = remainingOpacity at distance = coverageFraction
        const gradientSlope = Math.sqrt(-Math.log(remainingOpacity)) / coverageFraction;
        
        return gradientSlope;
    }

    // Utility functions
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    // Initialize form values
    initializeSprayConfigForm() {
        document.getElementById('sprayWidth').value = this.sprayConfig.sprayWidth;
        document.getElementById('sprayOpacity').value = this.sprayConfig.opacity;
        document.getElementById('sprayCoverage').value = this.sprayConfig.sprayCoverage;
        
        // Set color
        document.getElementById('sprayColorPicker').value = this.rgbToHex(
            this.sprayConfig.color.r,
            this.sprayConfig.color.g,
            this.sprayConfig.color.b
        );
        this.updateColorInputs(this.sprayConfig.color);
    }
}