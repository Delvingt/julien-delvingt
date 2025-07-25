/**
 * Portfolio/CV Website - Main JavaScript File
 * 
 * This file contains all the interactive features and animations for the portfolio website:
 * - PDF download functionality with analytics
 * - Text animations (typewriter effect)
 * - Skill bars animations
 * - Scroll-triggered animations
 * - Digital background effects
 * - Particle effects
 * - Tech glitch effects
 * 
 * @author Julien Delvingt
 */

// ===================================
// INITIALIZATION
// ===================================

/**
 * Main initialization function
 * Runs when the DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Core functionality
    initPDFDownloadButton();
    animateSkillBars();
    
    // Text animations with delays
    enhancedTypeWriter('typing-name', 'Julien Delvingt', 100);
    setTimeout(() => {
        enhancedTypeWriter('typing-title', 'Industrial Automaton Engineer', 50);
    }, 1000);
    
    // Scroll animations
    animateSectionsOnScroll();
    
    // Visual effects
    initDigitalBackground();
    addTechGlitch();
    createParticles();
    
    // Add theme class for CSS animations
    document.body.classList.add('digital-theme');
});

// ===================================
// ANALYTICS MODULE
// ===================================

/**
 * Analytics tracking module
 * Handles all Google Analytics event tracking
 */
const Analytics = {
    /**
     * Generic event tracking method
     * @param {string} eventName - The name of the event
     * @param {string} eventLabel - The label for the event
     * @param {number|null} value - Optional numeric value for the event
     */
    trackEvent: function(eventName, eventLabel, value = null) {
        if (typeof gtag !== 'undefined') {
            const eventParams = {
                'event_category': 'engagement',
                'event_label': eventLabel
            };
            
            if (value !== null) {
                eventParams.value = value;
            }
            
            gtag('event', eventName, eventParams);
        }
    },
    
    /**
     * Track PDF download events
     */
    trackPDFDownload: function() {
        this.trackEvent('download_cv', 'pdf_download', 1);
    },
    
    /**
     * Track contact link clicks
     * @param {string} contactType - Type of contact (email, phone, linkedin, etc.)
     */
    trackContactClick: function(contactType) {
        this.trackEvent('contact_click', contactType);
    },
    
    /**
     * Track section view events
     * @param {string} sectionName - Name of the section being viewed
     */
    trackSectionView: function(sectionName) {
        this.trackEvent('section_view', sectionName);
    }
};

// ===================================
// PDF DOWNLOAD FUNCTIONALITY
// ===================================

/**
 * Initialize PDF download button with animations and tracking
 * Handles download states, animations, and accessibility
 */
function initPDFDownloadButton() {
    const pdfBtn = document.querySelector('.pdf-download-btn');
    
    if (!pdfBtn) {
        console.warn('PDF download button not found');
        return;
    }
    
    // Configuration object
    const config = {
        downloadingText: 'Downloading...',
        successText: 'Downloaded!',
        errorText: 'Error!',
        defaultText: 'Download CV',
        animationDuration: 500,
        resetDuration: 2000,
        pdfPath: 'documents/Julien_Delvingt_CV.pdf'
    };
    
    // Store original button content for reset
    const originalHTML = pdfBtn.innerHTML;
    
    /**
     * Updates button state with icon and text
     * @param {string} iconClass - Font Awesome icon class
     * @param {string} text - Button text
     * @param {string|null} additionalClass - Optional CSS class to add
     */
    function updateButtonState(iconClass, text, additionalClass = null) {
        const icon = pdfBtn.querySelector('i');
        const textSpan = pdfBtn.querySelector('.btn-text');
        
        if (icon) icon.className = iconClass;
        if (textSpan) textSpan.textContent = text;
        
        if (additionalClass) {
            pdfBtn.classList.add(additionalClass);
        }
    }
    
    /**
     * Resets button to original state
     */
    function resetButton() {
        pdfBtn.innerHTML = originalHTML;
        pdfBtn.classList.remove('download-success', 'download-error');
        pdfBtn.style.pointerEvents = 'auto';
    }
    
    /**
     * Handles successful download
     */
    function handleDownloadSuccess() {
        updateButtonState('fas fa-check', config.successText, 'download-success');
        Analytics.trackPDFDownload();
        
        setTimeout(resetButton, config.resetDuration);
    }
    
    /**
     * Handles download error
     */
    function handleDownloadError() {
        updateButtonState('fas fa-exclamation-triangle', config.errorText, 'download-error');
        
        setTimeout(resetButton, config.resetDuration + 1000);
    }
    
    /**
     * Main click handler
     * @param {Event} e - Click event
     */
    function handleClick(e) {
        // Prevent multiple clicks
        pdfBtn.style.pointerEvents = 'none';
        
        // Show downloading state
        updateButtonState('fas fa-spinner fa-spin', config.downloadingText);
        
        // Simulate download feedback after short delay
        setTimeout(handleDownloadSuccess, config.animationDuration);
    }
    
    /**
     * Handles keyboard accessibility
     * @param {KeyboardEvent} e - Keyboard event
     */
    function handleKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            pdfBtn.click();
        }
    }
    
    /**
     * Tracks first hover interaction
     */
    let hoverTracked = false;
    function handleFirstHover() {
        if (!hoverTracked) {
            Analytics.trackEvent('pdf_button_hover', 'first_hover');
            hoverTracked = true;
        }
    }
    
    /**
     * Mobile touch start handler
     */
    function handleTouchStart() {
        pdfBtn.classList.add('touch-active');
    }
    
    /**
     * Mobile touch end handler
     */
    function handleTouchEnd() {
        setTimeout(() => {
            pdfBtn.classList.remove('touch-active');
        }, 300);
    }
    
    // Attach event listeners
    pdfBtn.addEventListener('click', handleClick);
    pdfBtn.addEventListener('keydown', handleKeydown);
    pdfBtn.addEventListener('mouseenter', handleFirstHover);
    
    // Mobile-specific events
    if ('ontouchstart' in window) {
        pdfBtn.addEventListener('touchstart', handleTouchStart);
        pdfBtn.addEventListener('touchend', handleTouchEnd);
    }
    
    // Track initial button visibility
    Analytics.trackEvent('page_view_with_pdf_button', 'pdf_button_visible');
    
    console.log('PDF download button initialized');
}

// ===================================
// SKILL BARS ANIMATION
// ===================================

/**
 * Animate skill progress bars on page load
 * Uses data-progress attribute to set target width
 */
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-progress');
        
        // Delay animation for better visual effect
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 500);
    });
}

// ===================================
// TEXT ANIMATIONS
// ===================================

/**
 * Enhanced typewriter effect with colored characters and scan effect
 * @param {string} elementId - ID of the target element
 * @param {string} text - Text to type
 * @param {number} speed - Typing speed in milliseconds
 */
function enhancedTypeWriter(elementId, text, speed) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = '';
    
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    element.appendChild(cursor);
    
    // Color palette for random character highlighting
    const colors = ['#4e7ae2', '#4a90e2', '#18c89b'];
    let colorIndex = 0;
    
    /**
     * Types one character at a time
     */
    function type() {
        if (i < text.length) {
            const charSpan = document.createElement('span');
            
            // Randomly color some characters (30% chance)
            if (text.charAt(i) !== ' ' && Math.random() > 0.7) {
                charSpan.style.color = colors[colorIndex % colors.length];
                colorIndex++;
            }
            
            charSpan.textContent = text.charAt(i);
            element.insertBefore(charSpan, cursor);
            i++;
            
            setTimeout(type, speed);
        } else {
            // Add scan effect after typing completes
            setTimeout(() => {
                const scanOverlay = document.createElement('div');
                scanOverlay.className = 'scan-effect';
                element.appendChild(scanOverlay);
                
                // Remove scan effect and cursor after animation
                setTimeout(() => {
                    scanOverlay.remove();
                    element.removeChild(cursor);
                }, 1500);
            }, 500);
        }
    }
    
    type();
}

// ===================================
// SCROLL ANIMATIONS
// ===================================

/**
 * Animate sections and process steps when they come into viewport
 */
function animateSectionsOnScroll() {
    const sections = document.querySelectorAll('.section');
    const processSteps = document.querySelectorAll('.process-step');
    
    /**
     * Check if element is visible in viewport
     * @param {HTMLElement} el - Element to check
     * @returns {boolean} True if element is visible
     */
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        const threshold = 0.85; // Trigger when 85% visible
        
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * threshold &&
            rect.bottom >= 0
        );
    }
    
    /**
     * Check visibility and add animation classes
     */
    function checkVisibility() {
        // Animate sections
        sections.forEach(section => {
            if (isElementInViewport(section)) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
                section.classList.add('appear');
            }
        });
        
        // Animate process steps with sequential delay
        processSteps.forEach((step, index) => {
            if (isElementInViewport(step)) {
                setTimeout(() => {
                    step.classList.add('appear');
                }, index * 300); // 300ms delay between each step
            }
        });
    }
    
    // Initialize section styles
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
    
    // Initial check on load
    checkVisibility();
    
    // Check on scroll
    window.addEventListener('scroll', checkVisibility);
}

// ===================================
// BACKGROUND EFFECTS
// ===================================

/**
 * Initialize animated digital network background
 * Creates a canvas with moving nodes and connections
 */
function initDigitalBackground() {
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'background-canvas';
    
    // Position canvas as fixed background
    Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '-2',
        opacity: '0.4'
    });
    
    // Insert canvas at the beginning of body
    document.body.insertBefore(canvas, document.body.firstChild);
    
    // Add circuit diagonal decoration
    const circuitDiagonal = document.createElement('div');
    circuitDiagonal.className = 'circuit-diagonal';
    document.body.insertBefore(circuitDiagonal, document.body.firstChild);
    
    const ctx = canvas.getContext('2d');
    
    /**
     * Resize canvas to match window dimensions
     */
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Configuration
    const config = {
        nodeCount: Math.floor(window.innerWidth / 100),
        connectionDistance: 150,
        nodeSize: 2,
        primaryColor: '#3a6ad4',
        accentColor: '#0bb588'
    };
    
    // Initialize nodes
    const nodes = [];
    for (let i = 0; i < config.nodeCount; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: config.nodeSize + Math.random() * 1.5,
            color: Math.random() > 0.8 ? config.accentColor : config.primaryColor,
            dataFlow: Math.random() > 0.7
        });
    }
    
    // Data flow particles
    const dataParticles = [];
    
    /**
     * Find connections between nearby nodes
     * @returns {Array} Array of connection objects
     */
    function findConnections() {
        const connections = [];
        
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < config.connectionDistance) {
                    connections.push({
                        from: i,
                        to: j,
                        distance: distance,
                        opacity: 1 - (distance / config.connectionDistance)
                    });
                    
                    // Randomly create data particles on connections
                    if (nodes[i].dataFlow && Math.random() > 0.995) {
                        dataParticles.push({
                            fromX: nodes[i].x,
                            fromY: nodes[i].y,
                            toX: nodes[j].x,
                            toY: nodes[j].y,
                            progress: 0,
                            speed: 0.005 + Math.random() * 0.01,
                            size: 1 + Math.random() * 2,
                            color: Math.random() > 0.3 ? config.primaryColor : config.accentColor
                        });
                    }
                }
            }
        }
        
        return connections;
    }
    
    /**
     * Main animation loop
     */
    function animate() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update node positions
        nodes.forEach(node => {
            // Bounce off edges
            if (node.x <= 0 || node.x >= canvas.width) node.vx *= -1;
            if (node.y <= 0 || node.y >= canvas.height) node.vy *= -1;
            
            // Update position
            node.x += node.vx;
            node.y += node.vy;
        });
        
        // Find and draw connections
        const connections = findConnections();
        
        ctx.lineWidth = 0.5;
        connections.forEach(connection => {
            const fromNode = nodes[connection.from];
            const toNode = nodes[connection.to];
            
            ctx.beginPath();
            ctx.moveTo(fromNode.x, fromNode.y);
            ctx.lineTo(toNode.x, toNode.y);
            ctx.strokeStyle = `rgba(58, 106, 212, ${connection.opacity * 0.4})`;
            ctx.stroke();
        });
        
        // Draw nodes
        nodes.forEach(node => {
            // Draw node
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
            ctx.fillStyle = node.color;
            ctx.fill();
            
            // Occasional halo effect
            if (Math.random() > 0.95) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(58, 106, 212, ${Math.random() * 0.08})`;
                ctx.fill();
            }
        });
        
        // Update and draw data particles
        for (let i = dataParticles.length - 1; i >= 0; i--) {
            const particle = dataParticles[i];
            
            // Update progress
            particle.progress += particle.speed;
            
            // Remove completed particles
            if (particle.progress >= 1) {
                dataParticles.splice(i, 1);
                continue;
            }
            
            // Calculate current position
            const currentX = particle.fromX + (particle.toX - particle.fromX) * particle.progress;
            const currentY = particle.fromY + (particle.toY - particle.fromY) * particle.progress;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(currentX, currentY, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        }
        
        // Occasionally create data bursts
        if (Math.random() > 0.98) {
            const sourceNode = nodes[Math.floor(Math.random() * nodes.length)];
            const burstCount = 3 + Math.floor(Math.random() * 5);
            
            for (let i = 0; i < burstCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = 50 + Math.random() * 100;
                
                dataParticles.push({
                    fromX: sourceNode.x,
                    fromY: sourceNode.y,
                    toX: sourceNode.x + Math.cos(angle) * distance,
                    toY: sourceNode.y + Math.sin(angle) * distance,
                    progress: 0,
                    speed: 0.01 + Math.random() * 0.02,
                    size: 1 + Math.random() * 1.5,
                    color: Math.random() > 0.3 ? config.primaryColor : config.accentColor
                });
            }
        }
        
        // Continue animation
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
}

// ===================================
// VISUAL EFFECTS
// ===================================

/**
 * Add glitch effect to technical skill elements
 * Creates random flickering effect on tech-related elements
 */
function addTechGlitch() {
    const techElements = document.querySelectorAll('.process-skill, .tag');
    
    techElements.forEach(element => {
        // Check for glitch effect periodically
        setInterval(() => {
            // 5% chance of glitch
            if (Math.random() > 0.95) {
                element.classList.add('tech-glitch');
                
                // Remove glitch after random duration
                setTimeout(() => {
                    element.classList.remove('tech-glitch');
                }, 200 + Math.random() * 300);
            }
        }, 3000);
    });
}

/**
 * Create floating particle effects
 * Adds ambient floating particles throughout the page
 */
function createParticles() {
    // Create container for particles
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);
    
    // Configuration
    const particleCount = 30;
    
    // Create individual particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Random animation delay for variety
        particle.style.animationDelay = `${Math.random() * 20}s`;
        
        // Random size (1-3px)
        const size = 1 + Math.random() * 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random opacity
        particle.style.opacity = 0.2 + Math.random() * 0.5;
        
        particlesContainer.appendChild(particle);
    }
}