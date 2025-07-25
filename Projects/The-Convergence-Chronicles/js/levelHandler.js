// Level button handler with expansion animation
function initializeLevelButtons() {
    // Reset any leftover animation state on init
    resetAnimationState();
    
    const buttons = document.querySelectorAll('.level');
    
    // Create overlay element for animation if it doesn't exist
    if (!document.querySelector('.level-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'level-overlay';
        document.body.appendChild(overlay);
    }
    
    // Create toast element for notifications if it doesn't exist
    if (!document.querySelector('.toast')) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    const overlay = document.querySelector('.level-overlay');
    const toast = document.querySelector('.toast');
    
    buttons.forEach(button => {
        button.addEventListener('click', handleLevelClick);
    });
    
    async function handleLevelClick(e) {
        const button = e.currentTarget;
        const levelNum = button.dataset.level;
        const levelHref = button.dataset.href || `../Ch1L${levelNum}/ch1l${levelNum}.html`; // Default href pattern
        
        // Check if level is locked
        if (button.classList.contains('locked')) {
            showToast('This level is locked! Complete previous levels first.');
            shakeButton(button);
            return;
        }
        
        // Check if level is available or completed
        if (button.classList.contains('available') || button.classList.contains('completed')) {
            // Check for saved node scheme in cache
            const savedNodeScheme = localStorage.getItem(`level_${levelNum}_nodes`);
            
            if (savedNodeScheme) {
                console.log(`Found saved node scheme for level ${levelNum}:`, JSON.parse(savedNodeScheme));
                // You can pass this data to the next page via sessionStorage
                sessionStorage.setItem('loadedNodeScheme', savedNodeScheme);
            }
            
            // Save current level state before leaving
            const levelState = {
                level: levelNum,
                stars: button.dataset.stars || 0,
                status: button.classList.contains('completed') ? 'completed' : 'available',
                hasNodeScheme: !!savedNodeScheme,
                timestamp: Date.now()
            };
            
            sessionStorage.setItem('currentLevel', JSON.stringify(levelState));
            
            // Start expansion animation
            await animateLevelEntry(button, levelHref);
        }
    }
    
    function animateLevelEntry(button, href) {
        return new Promise((resolve) => {
            // Set animation flag
            sessionStorage.setItem('animationInProgress', 'true');
            
            // Store original styles
            const originalStyles = {
                position: button.style.position,
                left: button.style.left,
                top: button.style.top,
                width: button.style.width,
                height: button.style.height,
                zIndex: button.style.zIndex
            };
            
            // Get button position
            const rect = button.getBoundingClientRect();
            
            // Create a clone for animation to avoid layout issues
            const clone = button.cloneNode(true);
            clone.style.position = 'fixed';
            clone.style.left = rect.left + 'px';
            clone.style.top = rect.top + 'px';
            clone.style.width = rect.width + 'px';
            clone.style.height = rect.height + 'px';
            clone.style.margin = '0';
            clone.style.zIndex = '1000';
            clone.classList.add('expanding');
            
            document.body.appendChild(clone);
            
            // Hide original button
            button.style.opacity = '0';
            
            // Activate overlay
            overlay.classList.add('active');
            
            // Navigate after animation
            setTimeout(() => {
                window.location.href = href;
                resolve();
            }, 800);
        });
    }
    
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    function shakeButton(button) {
        button.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            button.style.animation = '';
        }, 500);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLevelButtons);
} else {
    initializeLevelButtons();
}

// Reset animation state when page is shown (including back/forward navigation)
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        // Page was restored from cache
        resetAnimationState();
    }
});

// Also reset on visibility change (for mobile browsers)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        resetAnimationState();
    }
});

function resetAnimationState() {
    // Remove any cloned expanding buttons
    const expandingButtons = document.querySelectorAll('.level.expanding');
    expandingButtons.forEach(button => {
        if (button.style.position === 'fixed') {
            button.remove();
        }
    });
    
    // Reset original buttons visibility
    const allButtons = document.querySelectorAll('.level');
    allButtons.forEach(button => {
        button.style.opacity = '';
        button.style.animation = '';
        button.classList.remove('expanding');
    });
    
    // Reset overlay
    const overlay = document.querySelector('.level-overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
    
    // Clear any session storage flags
    sessionStorage.removeItem('animationInProgress');
}

// Utility function to save node schemes (call this from your level pages)
function saveNodeScheme(levelNum, nodeData) {
    localStorage.setItem(`level_${levelNum}_nodes`, JSON.stringify({
        nodes: nodeData.nodes || [],
        connections: nodeData.connections || [],
        savedAt: Date.now()
    }));
}

// Utility function to load node scheme for current level
function loadNodeScheme() {
    const currentLevel = JSON.parse(sessionStorage.getItem('currentLevel') || '{}');
    const nodeScheme = sessionStorage.getItem('loadedNodeScheme');
    
    if (nodeScheme) {
        // Clear it after loading to avoid reuse
        sessionStorage.removeItem('loadedNodeScheme');
        return JSON.parse(nodeScheme);
    }
    
    return null;
}

// Add the CSS to your document
if (!document.querySelector('#level-animation-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'level-animation-styles';
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
}