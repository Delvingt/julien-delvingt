/**
 * Chapter 1 Level 1 - The First Connection
 * Level-specific functionality
 */

// Level configuration
const LEVEL_CONFIG = {
    id: 'ch1l1',
    name: 'The First Connection',
    chapter: 1,
    level: 1,
    // Success criteria for this level
    criteria: {
        maxResponseTime: 5.0,       // Maximum allowed response time
        maxOvershoot: 10.0,         // Maximum allowed overshoot
        maxPower: 10.0,             // Maximum allowed Power Usage
        maxEnergy: 10.0,             // Maximum allowed Power Usage
    }
};

// Initialize level when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLevel();
});

/**
 * Initialize the level
 */
function initializeLevel() {
    console.log(`Initializing Level: ${LEVEL_CONFIG.name}`);
    
    // Load cached node scheme if available
    loadCachedNodeScheme();
    
    // Set up auto-save functionality
    setupAutoSave();
    
    // Initialize tutorial if first time
    checkFirstTimeUser();
}

/**
 * Load cached node scheme for this level
 */
function loadCachedNodeScheme() {
    const cachedScheme = cacheManager.loadNodeScheme(LEVEL_CONFIG.id);
    
    if (cachedScheme && model && model.editor) {
        try {
            // Clear current editor
            model.editor.clear();
            
            // Import cached scheme
            model.editor.import(cachedScheme);
            
            console.log('Cached node scheme loaded successfully');
            
            // Show notification to user
            showNotification('Previous work restored', 'info');
        } catch (error) {
            console.error('Error loading cached scheme:', error);
            // If error, add default blocks
            model.addDefaultBlocks();
        }
    }
}

/**
 * Set up auto-save functionality
 */
function setupAutoSave() {
    // Save on any node change
    if (model && model.editor) {
        // Save when connection is made
        model.editor.on('connectionCreated', function() {
            saveCurrentNodeScheme();
        });
        
        // Save when connection is removed
        model.editor.on('connectionRemoved', function() {
            saveCurrentNodeScheme();
        });
        
        // Save when node is added
        model.editor.on('nodeCreated', function() {
            saveCurrentNodeScheme();
        });
        
        // Save when node is removed
        model.editor.on('nodeRemoved', function() {
            saveCurrentNodeScheme();
        });
        
        // Save when node data is updated
        model.editor.on('nodeDataChanged', function() {
            saveCurrentNodeScheme();
        });
    }
    
    // Also save periodically (every 30 seconds)
    setInterval(saveCurrentNodeScheme, 30000);
}

/**
 * Save current node scheme to cache
 */
function saveCurrentNodeScheme() {
    if (model && model.editor) {
        const nodeScheme = model.getFlowData();
        const success = cacheManager.saveNodeScheme(LEVEL_CONFIG.id, nodeScheme);
        
        if (success) {
            console.log('Node scheme auto-saved');
        }
    }
}

/**
 * Check if this is the first time user is on this level
 */
function checkFirstTimeUser() {
    const completion = cacheManager.getLevelCompletion(LEVEL_CONFIG.id);
    
    if (!completion) {
        // First time on this level - ensure tutorials are shown
        console.log('First time on level - tutorials will be shown');
    } else {
        // User has been here before
        console.log('Returning user - previous best score:', completion.score);
    }
}

/**
 * Main function to check if level challenge is completed
 * Called when user clicks Submit Challenge button
 */
function checkLevelChallenge() {
    console.log('Checking level challenge...');
    
    // Disable submit button during check
    const submitBtn = document.getElementById('submitChallenge');
    submitBtn.disabled = true;
    
    // Clear previous status
    updateChallengeStatus('');
    
    // Check if simulation has been run
    if (!results || !results.simulationData || results.simulationData.timeData.length === 0) {
        updateChallengeStatus('Please run the simulation first!', 'warning');
        submitBtn.disabled = false;
        return;
    }
    
    // Get simulation data
    const simData = results.simulationData;
    const flowData = model.getFlowData();
    
    // Perform checks
    const checks = performLevelChecks(simData, flowData);
    
    // Determine overall success
    const success = Object.values(checks).every(check => check.passed);
    
    // Display results
    displayCheckResults(checks, success);
    
    // Re-enable submit button
    submitBtn.disabled = false;
    
    // If successful, save completion
    if (success) {
        saveLevelCompletion(checks);
        // Enable next level button
        enableNextLevel();
    }
}

/**
 * Perform all checks for this level
 */
function performLevelChecks(simData, flowData) {
    const checks = {};
    
    // Check 1: Response time
    checks.responseTime = checkResponseTime(simData);
    
    // Check 2: Overshoot
    checks.overshoot = checkOvershoot(simData);
    
    return checks;
}

/**
 * Check response time criteria
 */
function checkResponseTime(simData) {
    // Calculate response time (already done in processResults)
    const responseTimeElement = document.getElementById('responseTime');
    const responseTimeText = responseTimeElement.textContent;
    
    if (responseTimeText === '--' || responseTimeText === 'Infinity') {
        return {
            passed: false,
            message: 'System did not reach steady state'
        };
    }
    
    const responseTime = parseFloat(responseTimeText);
    const passed = responseTime <= LEVEL_CONFIG.criteria.maxResponseTime;
    
    return {
        passed: passed,
        value: responseTime,
        message: `Response time: ${responseTime.toFixed(2)}s ${passed ? '✓' : '✗'} (max: ${LEVEL_CONFIG.criteria.maxResponseTime}s)`
    };
}

/**
 * Check overshoot criteria
 */
function checkOvershoot(simData) {
    const overshootElement = document.getElementById('overshoot');
    const overshootText = overshootElement.textContent;
    
    if (overshootText === '--') {
        return {
            passed: false,
            message: 'Overshoot data not available'
        };
    }
    
    const overshoot = parseFloat(overshootText);
    const passed = overshoot <= LEVEL_CONFIG.criteria.maxOvershoot;
    
    return {
        passed: passed,
        value: overshoot,
        message: `Overshoot: ${overshoot.toFixed(1)}% ${passed ? '✓' : '✗'} (max: ${LEVEL_CONFIG.criteria.maxOvershoot}%)`
    };
}

/**
 * Display check results to user
 */
function displayCheckResults(checks, success) {
    let message = '';
    
    if (success) {
        message = '🎉 Challenge Completed! All criteria met!';
        updateChallengeStatus(message, 'success');
        
        // Show detailed results after a short delay
        setTimeout(() => {
            let details = 'Performance Summary:\n';
            for (const check of Object.values(checks)) {
                details += `\n${check.message}`;
            }
            console.log(details);
        }, 500);
    } else {
        message = 'Challenge not yet complete. Review the criteria:';
        let details = '';
        
        for (const check of Object.values(checks)) {
            if (!check.passed) {
                details += `\n• ${check.message}`;
            }
        }
        
        updateChallengeStatus(message + details, 'error');
    }
}

/**
 * Update challenge status display
 */
function updateChallengeStatus(message, type = '') {
    const statusElement = document.getElementById('challengeStatus');
    
    if (!message) {
        statusElement.classList.remove('show', 'success', 'error', 'warning');
        statusElement.textContent = '';
        return;
    }
    
    statusElement.textContent = message;
    statusElement.className = 'challenge-status';
    
    if (type) {
        statusElement.classList.add(type);
    }
    
    // Trigger animation
    setTimeout(() => {
        statusElement.classList.add('show');
    }, 10);
}

/**
 * Save level completion data
 */
function saveLevelCompletion(checks) {
    const completionData = {
        completed: true,
        score: calculateScore(checks),
        responseTime: checks.responseTime.value || null,
        overshoot: checks.overshoot.value || null,
        attempts: (cacheManager.getLevelCompletion(LEVEL_CONFIG.id)?.attempts || 0) + 1
    };
    
    cacheManager.saveLevelCompletion(LEVEL_CONFIG.id, completionData);
    
    // Also save the successful node scheme
    saveCurrentNodeScheme();
}

/**
 * Calculate score based on performance
 */
function calculateScore(checks) {
    let score = 0;
    
    // Base score for completion
    score += 50;
    
    // Bonus for response time
    if (checks.responseTime.value) {
        const timeRatio = checks.responseTime.value / LEVEL_CONFIG.criteria.maxResponseTime;
        score += Math.floor(20 * (1 - timeRatio));
    }
    
    // Bonus for low overshoot
    if (checks.overshoot.value !== undefined) {
        const overshootRatio = checks.overshoot.value / LEVEL_CONFIG.criteria.maxOvershoot;
        score += Math.floor(20 * (1 - overshootRatio));
    }
    
    return Math.max(0, Math.min(100, score));
}

/**
 * Enable next level button
 */
function enableNextLevel() {
    const nextBtn = document.querySelector('.menubar-btn.next');
    if (nextBtn) {
        nextBtn.classList.add('enabled');
        nextBtn.style.pointerEvents = 'auto';
        nextBtn.style.opacity = '1';
    }
}

/**
 * Show notification to user
 */
function showNotification(message, type = 'info') {
    // Simple console log for now - can be replaced with toast notification
    console.log(`[${type.toUpperCase()}] ${message}`);
}

// Export level config for other modules if needed
window.CURRENT_LEVEL = LEVEL_CONFIG;