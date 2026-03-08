// Apply user progress from localStorage to the campaign DOM
function applyUserProgress() {
    if (typeof cacheManager === 'undefined') return;

    const LEVELS_PER_CHAPTER = 12;
    const STARS_PER_LEVEL = 3;
    const TOTAL_CHAPTERS = 5;

    let overallStars = 0;
    let overallCompleted = 0;

    // Track completed counts per chapter for unlock logic
    const chapterCompletedCounts = {};

    // First pass: count completions per chapter
    for (let ch = 1; ch <= TOTAL_CHAPTERS; ch++) {
        let count = 0;
        for (let lv = 1; lv <= LEVELS_PER_CHAPTER; lv++) {
            const completion = cacheManager.getLevelCompletion(`ch${ch}l${lv}`);
            if (completion && completion.completed) count++;
        }
        chapterCompletedCounts[ch] = count;
    }

    // Determine which chapters are unlocked
    // Chapter 1 always unlocked; Chapter N unlocked if ALL levels of chapter N-1 are completed
    const chapterUnlocked = {};
    chapterUnlocked[1] = true;
    for (let ch = 2; ch <= TOTAL_CHAPTERS; ch++) {
        chapterUnlocked[ch] = chapterCompletedCounts[ch - 1] >= LEVELS_PER_CHAPTER;
    }

    // Process each chapter section
    const chapterSections = document.querySelectorAll('.chapter[data-chapter]');
    chapterSections.forEach(section => {
        const ch = parseInt(section.dataset.chapter);
        const isUnlocked = chapterUnlocked[ch];

        // Set chapter unlock state
        section.classList.remove('unlocked', 'locked');
        section.classList.add(isUnlocked ? 'unlocked' : 'locked');

        // Handle locked chapter display
        if (!isUnlocked) {
            // Hide levels grid for locked chapters
            const grid = section.querySelector('.levels-grid');
            if (grid) grid.style.display = 'none';

            // Ensure chapter-lock message is shown
            let lockEl = section.querySelector('.chapter-lock');
            if (!lockEl) {
                const header = section.querySelector('.chapter-header');
                // Remove chapter-stars if present (locked chapters show lock instead)
                const starsEl = header.querySelector('.chapter-stars');
                if (starsEl) starsEl.style.display = 'none';

                lockEl = document.createElement('div');
                lockEl.className = 'chapter-lock';
                lockEl.innerHTML = `<i class="fas fa-lock"></i><span>Complete Chapter ${ch - 1}</span>`;
                header.appendChild(lockEl);
            }

            // Update progress text
            const progressText = section.querySelector('.progress-text');
            if (progressText) progressText.textContent = 'Locked';
            const progressFill = section.querySelector('.progress-fill');
            if (progressFill) progressFill.style.width = '0%';

            return;
        }

        // Chapter is unlocked — show levels grid and chapter-stars
        const grid = section.querySelector('.levels-grid');
        if (grid) grid.style.display = '';
        const lockEl = section.querySelector('.chapter-lock');
        if (lockEl) lockEl.remove();
        const chapterStarsEl = section.querySelector('.chapter-stars');
        if (chapterStarsEl) chapterStarsEl.style.display = '';

        let chapterStars = 0;
        let chapterCompleted = 0;
        let prevCompleted = true; // Level 1 is always available in an unlocked chapter

        const buttons = section.querySelectorAll('.level[data-level]');
        buttons.forEach(button => {
            const lv = parseInt(button.dataset.level);
            const levelId = `ch${ch}l${lv}`;
            const completion = cacheManager.getLevelCompletion(levelId);
            const isCompleted = completion && completion.completed;
            const starsDiv = button.querySelector('.level-stars');

            // Remove existing classes
            button.classList.remove('completed', 'available', 'locked', 'current');

            if (isCompleted) {
                // Completed level
                const stars = STARS_PER_LEVEL; // Binary scoring: 3 stars if completed
                button.classList.add('completed');
                button.dataset.stars = stars;
                chapterStars += stars;
                chapterCompleted++;

                // Render filled stars
                if (starsDiv) {
                    starsDiv.innerHTML = '<i class="fas fa-star"></i>'.repeat(stars) +
                        '<i class="far fa-star"></i>'.repeat(STARS_PER_LEVEL - stars);
                }

                prevCompleted = true;
            } else if (prevCompleted) {
                // Available: previous level was completed (or this is level 1)
                button.classList.add('available');
                button.dataset.stars = '0';

                // Render empty stars
                if (starsDiv) {
                    starsDiv.innerHTML = '<i class="far fa-star"></i>'.repeat(STARS_PER_LEVEL);
                }

                prevCompleted = false;
            } else {
                // Locked
                button.classList.add('locked');
                button.dataset.stars = '0';

                // Render lock icon
                if (starsDiv) {
                    starsDiv.innerHTML = '';
                }
                // Add lock icon if not already present
                if (!button.querySelector('.level-lock')) {
                    const lockIcon = document.createElement('i');
                    lockIcon.className = 'fas fa-lock level-lock';
                    button.appendChild(lockIcon);
                }
            }

            // Remove lock icon from non-locked levels
            if (!button.classList.contains('locked')) {
                const existingLock = button.querySelector('.level-lock');
                if (existingLock) existingLock.remove();
            }
        });

        // Update chapter progress bar
        const progressFill = section.querySelector('.progress-fill');
        const progressText = section.querySelector('.progress-text');
        if (progressFill) {
            progressFill.style.width = (chapterCompleted / LEVELS_PER_CHAPTER * 100) + '%';
        }
        if (progressText) {
            progressText.textContent = `${chapterCompleted}/${LEVELS_PER_CHAPTER} Levels`;
        }

        // Update chapter star count
        if (chapterStarsEl) {
            const spanEl = chapterStarsEl.querySelector('span');
            if (spanEl) {
                spanEl.textContent = `${chapterStars}/${LEVELS_PER_CHAPTER * STARS_PER_LEVEL}`;
            }
        }

        overallStars += chapterStars;
        overallCompleted += chapterCompleted;
    });

    // Update overall stats
    const totalLevels = TOTAL_CHAPTERS * LEVELS_PER_CHAPTER;
    const totalStarsEl = document.getElementById('totalStars');
    const totalLevelsEl = document.getElementById('totalLevels');
    const totalPercentEl = document.getElementById('totalPercent');

    if (totalStarsEl) totalStarsEl.textContent = overallStars;
    if (totalLevelsEl) totalLevelsEl.textContent = `${overallCompleted}/${totalLevels}`;
    if (totalPercentEl) totalPercentEl.textContent = `${Math.round(overallCompleted / totalLevels * 100)}%`;
}

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
        const chapterNum = button.closest('[data-chapter]')?.dataset.chapter || '1';
        const levelHref = button.dataset.href || `../Ch${chapterNum}L${levelNum}/ch${chapterNum}l${levelNum}.html`;
        
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
function initCampaign() {
    applyUserProgress();
    initializeLevelButtons();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCampaign);
} else {
    initCampaign();
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