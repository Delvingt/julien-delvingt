// Convert between user-friendly coverage percentage and gradient slope
class SprayPatternConverter {
    /**
     * Convert coverage percentage to gradient slope
     * @param {number} coveragePercent - Percentage of spray width containing X% of paint (0-100)
     * @param {number} paintPercent - Percentage of paint contained (default 90%)
     * @returns {number} gradientSlope value
     */
    static coverageToGradientSlope(coveragePercent, paintPercent = 90) {
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
    
    /**
     * Convert gradient slope to coverage percentage
     * @param {number} gradientSlope - The gradient slope value
     * @param {number} paintPercent - Percentage of paint to calculate coverage for (default 90%)
     * @returns {number} coveragePercent - Percentage of spray width
     */
    static gradientSlopeToCoverage(gradientSlope, paintPercent = 90) {
        const remainingOpacity = (100 - paintPercent) / 100;
        
        // Calculate at what distance the opacity drops to remainingOpacity
        const distance = Math.sqrt(-Math.log(remainingOpacity)) / gradientSlope;
        
        // Convert to percentage and clamp to valid range
        const coveragePercent = Math.min(100, distance * 100);
        
        return coveragePercent;
    }
    
    /**
     * Get descriptive text for the spray pattern
     * @param {number} coveragePercent - Percentage of spray width containing 90% of paint
     * @returns {string} Description of the spray pattern
     */
    static getPatternDescription(coveragePercent) {
        if (coveragePercent <= 30) {
            return "Very focused beam - Sharp edges, concentrated center";
        } else if (coveragePercent <= 50) {
            return "Focused spray - Clear center with defined edges";
        } else if (coveragePercent <= 70) {
            return "Balanced spray - Even distribution with soft edges";
        } else if (coveragePercent <= 85) {
            return "Wide spray - Soft, diffused pattern";
        } else {
            return "Very wide spray - Extremely soft, cloud-like pattern";
        }
    }
}

// Example HTML implementation for the user interface
const sprayPatternUI = {
    // Initialize the UI elements
    init() {
        // Create the intuitive slider
        const html = `
        <div class="spray-pattern-control">
            <label for="coverageSlider">
                Spray Focus
                <span class="help-text">90% of paint falls within this percentage of spray width</span>
            </label>
            
            <div class="slider-container">
                <span class="slider-label">Focused</span>
                <input type="range" 
                       id="coverageSlider" 
                       min="20" 
                       max="95" 
                       value="60" 
                       step="5"
                       oninput="sprayPatternUI.updateFromSlider(this.value)">
                <span class="slider-label">Diffused</span>
            </div>
            
            <div class="coverage-display">
                <div class="coverage-value">
                    <strong id="coverageValue">60</strong>% of spray width
                </div>
                <div class="pattern-description" id="patternDescription">
                    Balanced spray - Even distribution with soft edges
                </div>
            </div>
            
            <!-- Visual preview -->
            <div class="spray-preview">
                <canvas id="sprayPreview" width="300" height="100"></canvas>
            </div>
            
            <!-- Advanced settings (collapsible) -->
            <details class="advanced-settings">
                <summary>Advanced Settings</summary>
                <div class="advanced-controls">
                    <label>
                        Paint concentration:
                        <select id="paintPercent" onchange="sprayPatternUI.updatePaintPercent()">
                            <option value="80">80% of paint</option>
                            <option value="90" selected>90% of paint</option>
                            <option value="95">95% of paint</option>
                            <option value="99">99% of paint</option>
                        </select>
                    </label>
                    <div class="gradient-slope-display">
                        Gradient slope value: <span id="gradientSlopeValue">2.54</span>
                    </div>
                </div>
            </details>
        </div>
        `;
        
        // Add CSS for better visualization
        const styles = `
        <style>
        .spray-pattern-control {
            padding: 20px;
            background: #f5f5f5;
            border-radius: 8px;
            font-family: Arial, sans-serif;
        }
        
        .help-text {
            display: block;
            font-size: 0.85em;
            color: #666;
            margin-top: 4px;
        }
        
        .slider-container {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 20px 0;
        }
        
        .slider-label {
            font-size: 0.9em;
            color: #666;
        }
        
        #coverageSlider {
            flex: 1;
        }
        
        .coverage-display {
            text-align: center;
            margin: 20px 0;
        }
        
        .coverage-value {
            font-size: 1.2em;
            margin-bottom: 8px;
        }
        
        .pattern-description {
            color: #666;
            font-style: italic;
        }
        
        .spray-preview {
            margin: 20px 0;
            text-align: center;
        }
        
        #sprayPreview {
            border: 1px solid #ddd;
            background: white;
        }
        
        .advanced-settings {
            margin-top: 20px;
            padding: 10px;
            background: #eee;
            border-radius: 4px;
        }
        
        .advanced-controls {
            padding-top: 10px;
        }
        
        .gradient-slope-display {
            margin-top: 10px;
            font-size: 0.9em;
            color: #666;
        }
        </style>
        `;
        
        // This would be added to your HTML
        return styles + html;
    },
    
    // Update when slider changes
    updateFromSlider(coveragePercent) {
        const paintPercent = parseInt(document.getElementById('paintPercent').value);
        const gradientSlope = SprayPatternConverter.coverageToGradientSlope(coveragePercent, paintPercent);
        
        // Update display
        document.getElementById('coverageValue').textContent = coveragePercent;
        document.getElementById('gradientSlopeValue').textContent = gradientSlope.toFixed(2);
        document.getElementById('patternDescription').textContent = 
            SprayPatternConverter.getPatternDescription(coveragePercent);
        
        // Update visual preview
        this.drawSprayPreview(gradientSlope);
        
        // Update the actual spray config
        if (window.sprayConfig) {
            window.sprayConfig.gradientSlope = gradientSlope;
            // Trigger chart update if needed
            if (window.updatePaintPatternChart) {
                window.updatePaintPatternChart();
            }
        }
    },
    
    // Update when paint percentage changes
    updatePaintPercent() {
        const coveragePercent = parseInt(document.getElementById('coverageSlider').value);
        this.updateFromSlider(coveragePercent);
    },
    
    // Draw visual preview of spray pattern
    drawSprayPreview(gradientSlope) {
        const canvas = document.getElementById('sprayPreview');
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw spray pattern
        const centerX = width / 2;
        const sprayWidth = width * 0.8;
        
        for (let x = 0; x < width; x++) {
            const distance = Math.abs(x - centerX) / (sprayWidth / 2);
            if (distance <= 1) {
                const opacity = Math.exp(-Math.pow(distance * gradientSlope, 2));
                ctx.fillStyle = `rgba(0, 100, 200, ${opacity * 0.8})`;
                ctx.fillRect(x, 0, 1, height);
            }
        }
        
        // Draw coverage indicator
        const paintPercent = parseInt(document.getElementById('paintPercent').value);
        const coveragePercent = SprayPatternConverter.gradientSlopeToCoverage(gradientSlope, paintPercent);
        const coverageWidth = (coveragePercent / 100) * sprayWidth;
        
        ctx.strokeStyle = '#ff0000';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(centerX - coverageWidth / 2, 0);
        ctx.lineTo(centerX - coverageWidth / 2, height);
        ctx.moveTo(centerX + coverageWidth / 2, 0);
        ctx.lineTo(centerX + coverageWidth / 2, height);
        ctx.stroke();
        
        // Add labels
        ctx.setLineDash([]);
        ctx.fillStyle = '#ff0000';
        ctx.font = '12px Arial';
        ctx.fillText(`${paintPercent}% of paint`, centerX - 30, height - 5);
    }
};

// Integration with your existing code
function updatePaintPatternChartWithIntuitive() {
    // Get the coverage percentage from UI
    const coveragePercent = parseInt(document.getElementById('coverageSlider').value);
    const paintPercent = parseInt(document.getElementById('paintPercent').value);
    
    // Convert to gradient slope
    this.sprayConfig.gradientSlope = SprayPatternConverter.coverageToGradientSlope(coveragePercent, paintPercent);
    
    // Rest of your existing updatePaintPatternChart function
    // ...
}