/**
 * Theme Generator - Unified Version
 * Creates an animated glassmorphic background with customizable parameters
 * Supports both fixed (viewport) and absolute (full-page) positioning modes
 * 
 * Usage: 
 * <script src="glassmorphic-bg.js"></script>
 * <script>
 *   ThemeGenerator.init({
 *     backgroundMode: 'fixed', // or 'absolute' for full-page
 *     colorTheme: 'ocean',
 *     bubbleSize: 150,
 *     animationSpeed: 50,
 *     // ... other options
 *   });
 * </script>
 */

const ThemeGenerator = (function() {
  'use strict';

  // Default configuration
  const defaultConfig = {
    // Positioning mode
    backgroundMode: 'fixed', // 'fixed' (viewport) or 'absolute' (full-page)
    
    // Visual settings
    colorTheme: 'aurora', // 'aurora', 'ocean', 'sunset', 'forest', 'galaxy', 'custom'
    customColors: ['#667eea', '#764ba2', '#f093fb'], // Used when colorTheme is 'custom'
    bubbleSize: 120, // Average bubble diameter in pixels
    bubbleSizeVariation: 0.5, // Size variation factor (0-1)
    animationSpeed: 30, // 0-100, where 0 is no animation
    bubbleCount: 15, // Number of bubbles
    bubbleDensity: 0.00003, // Bubbles per pixel of page height (for auto-scaling in absolute mode)
    useAutoBubbleCount: false, // Auto-scale bubble count in absolute mode based on page height
    blurIntensity: 10, // Glass blur effect intensity
    glassOpacity: 0.15, // Glass layer opacity (0-1)
    gradientAngle: 135, // Background gradient angle in degrees
    noiseOpacity: 0.03, // Subtle noise texture opacity (0-1)
    mouseInteraction: true, // Enable mouse parallax effect
    mouseInfluence: 0.1, // How much mouse affects bubble movement (0-1)
    glowIntensity: 0.8, // Bubble glow effect intensity (0-1)
    pulseAnimation: true, // Enable subtle pulse animation on bubbles
    pulseSpeed: 0.5, // Pulse animation speed multiplier
    applyThemeStyles: true, // Apply matching color theme to UI elements
    
    // Performance settings (mainly for absolute mode)
    performanceMode: 'auto', // 'high', 'balanced', 'low', 'auto' - adjusts based on page size
    maxCanvasHeight: 10000, // Maximum canvas height to prevent memory issues (absolute mode)
    animateOnlyInViewport: true, // Only animate bubbles that are currently visible (absolute mode)
  };

  // Current configuration (merged default + user config)
  let config = {};

  // Module-level variables
  let canvas, ctx;
  let bubbles = [];
  let animationId;
  let mouseX = 0, mouseY = 0;
  let time = 0;
  let documentHeight = 0;
  let viewportHeight = 0;
  let scrollY = 0;
  let resizeObserver = null;

  // Color themes
  const colorThemes = {
    aurora: ['#00ff88', '#00ffff', '#ff00ff', '#8000ff'],
    ocean: ['#0077be', '#00a8cc', '#00d4aa', '#90e0ef'],
    sunset: ['#ff6b6b', '#ff8e53', '#fe6b8b', '#ff5e7e'],
    forest: ['#2d6a4f', '#52b788', '#95d5b2', '#b7e4c7'],
    galaxy: ['#6c5ce7', '#a29bfe', '#fd79a8', '#e17055'],
    neon: ['#00ff41', '#00ffff', '#ff00ff', '#ffff00'],
    lavender: ['#e0c3fc', '#c3b1e1', '#a8dadc', '#b8b8ff'],
    fire: ['#ff4757', '#ff6348', '#ff7f50', '#ffa500']
  };

  // UI Theme palettes that complement each background theme
  const themeStyles = {
    aurora: {
      primary: '#00ff88',
      secondary: '#8000ff',
      accent: '#ff00ff',
      text: '#ffffff',
      textMuted: 'rgba(255, 255, 255, 0.7)',
      bgGlass: 'rgba(255, 255, 255, 0.1)',
      bgGlassHover: 'rgba(255, 255, 255, 0.15)',
      border: 'rgba(255, 255, 255, 0.2)',
      borderHover: 'rgba(255, 255, 255, 0.3)',
      shadow: 'rgba(0, 255, 136, 0.2)',
      error: '#ff6b6b',
      success: '#00ff88',
      warning: '#ffff00'
    },
    ocean: {
      primary: '#00a8cc',
      secondary: '#0077be',
      accent: '#00d4aa',
      text: '#ffffff',
      textMuted: 'rgba(255, 255, 255, 0.7)',
      bgGlass: 'rgba(255, 255, 255, 0.08)',
      bgGlassHover: 'rgba(255, 255, 255, 0.12)',
      border: 'rgba(255, 255, 255, 0.2)',
      borderHover: 'rgba(0, 212, 170, 0.4)',
      shadow: 'rgba(0, 168, 204, 0.2)',
      error: '#ff6b6b',
      success: '#00d4aa',
      warning: '#ffd93d'
    },
    sunset: {
      primary: '#dc2626',          // Darker red
      secondary: '#ea580c',        // Darker orange
      accent: '#db2777',           // Darker pink
      text: '#1f2937',             // Very dark gray
      textMuted: 'rgba(31, 41, 55, 0.8)',   // Dark gray with opacity
      bgGlass: 'rgba(255, 255, 255, 0.7)',  // More opaque
      bgGlassHover: 'rgba(255, 255, 255, 0.85)',
      border: 'rgba(220, 38, 38, 0.3)',
      borderHover: 'rgba(220, 38, 38, 0.5)',
      shadow: 'rgba(220, 38, 38, 0.3)',
      error: '#991b1b',            // Even darker red
      success: '#059669',
      warning: '#d97706'
    },
    forest: {
      primary: '#52b788',
      secondary: '#2d6a4f',
      accent: '#95d5b2',
      text: '#ffffff',
      textMuted: 'rgba(255, 255, 255, 0.75)',
      bgGlass: 'rgba(255, 255, 255, 0.08)',
      bgGlassHover: 'rgba(255, 255, 255, 0.12)',
      border: 'rgba(255, 255, 255, 0.2)',
      borderHover: 'rgba(149, 213, 178, 0.4)',
      shadow: 'rgba(82, 183, 136, 0.2)',
      error: '#ff6b6b',
      success: '#95d5b2',
      warning: '#ffd93d'
    },
    galaxy: {
      primary: '#a29bfe',
      secondary: '#6c5ce7',
      accent: '#fd79a8',
      text: '#ffffff',
      textMuted: 'rgba(255, 255, 255, 0.75)',
      bgGlass: 'rgba(255, 255, 255, 0.1)',
      bgGlassHover: 'rgba(255, 255, 255, 0.15)',
      border: 'rgba(255, 255, 255, 0.2)',
      borderHover: 'rgba(162, 155, 254, 0.4)',
      shadow: 'rgba(108, 92, 231, 0.3)',
      error: '#ff6b6b',
      success: '#55efc4',
      warning: '#fdcb6e'
    },
    neon: {
      primary: '#00ff41',
      secondary: '#00ffff',
      accent: '#ff00ff',
      text: '#ffffff',
      textMuted: 'rgba(255, 255, 255, 0.8)',
      bgGlass: 'rgba(255, 255, 255, 0.05)',
      bgGlassHover: 'rgba(255, 255, 255, 0.1)',
      border: 'rgba(255, 255, 255, 0.2)',
      borderHover: 'rgba(0, 255, 65, 0.5)',
      shadow: 'rgba(0, 255, 255, 0.3)',
      error: '#ff0040',
      success: '#00ff41',
      warning: '#ffff00'
    },
    lavender: {
      primary: '#8b7aa8',           // Darker purple for better contrast
      secondary: '#b99bd8',         // Slightly darker lavender
      accent: '#6ba3a7',           // Darker teal accent
      text: '#2d3748',             // Dark gray instead of white
      textMuted: 'rgba(45, 55, 72, 0.8)',  // Dark gray with opacity
      bgGlass: 'rgba(255, 255, 255, 0.7)',  // More opaque white
      bgGlassHover: 'rgba(255, 255, 255, 0.85)',  // Even more opaque on hover
      border: 'rgba(139, 122, 168, 0.3)',   // Purple-tinted border
      borderHover: 'rgba(139, 122, 168, 0.5)',  // Stronger on hover
      shadow: 'rgba(139, 122, 168, 0.3)',   // Purple shadow
      error: '#dc2626',            // Stronger red
      success: '#059669',          // Stronger green
      warning: '#d97706'           // Stronger amber
    },
    fire: {
      primary: '#dc2626',          // Darker red
      secondary: '#ea580c',        // Darker orange
      accent: '#f59e0b',           // Darker amber
      text: '#1f2937',             // Very dark gray
      textMuted: 'rgba(31, 41, 55, 0.8)',
      bgGlass: 'rgba(255, 255, 255, 0.7)',
      bgGlassHover: 'rgba(255, 255, 255, 0.85)',
      border: 'rgba(220, 38, 38, 0.3)',
      borderHover: 'rgba(220, 38, 38, 0.5)',
      shadow: 'rgba(220, 38, 38, 0.3)',
      error: '#991b1b',
      success: '#059669',
      warning: '#f59e0b'
    }
  };

  function applyThemeStyles() {
    if (!config.applyThemeStyles) return;

    const theme = config.colorTheme === 'custom' ? 'aurora' : config.colorTheme;
    const palette = themeStyles[theme];

    // Remove existing theme styles if any
    const existingStyles = document.getElementById('glassmorphic-theme-styles');
    if (existingStyles) existingStyles.remove();

    // Create style element
    const styleEl = document.createElement('style');
    styleEl.id = 'glassmorphic-theme-styles';
    
    styleEl.textContent = `
      /* CSS Custom Properties for easy customization */
      :root {
        --glass-primary: ${palette.primary};
        --glass-secondary: ${palette.secondary};
        --glass-accent: ${palette.accent};
        --glass-text: ${palette.text};
        --glass-text-muted: ${palette.textMuted};
        --glass-bg: ${palette.bgGlass};
        --glass-bg-hover: ${palette.bgGlassHover};
        --glass-border: ${palette.border};
        --glass-border-hover: ${palette.borderHover};
        --glass-shadow: ${palette.shadow};
        --glass-error: ${palette.error};
        --glass-success: ${palette.success};
        --glass-warning: ${palette.warning};
      }

      ${config.backgroundMode === 'absolute' ? `
      /* Ensure body has proper positioning context for absolute mode */
      body {
        position: relative;
        min-height: 100vh;
      }` : ''}

      /* Glass container styles */
      .glass-box,
      .glass-card {
        background: var(--glass-bg);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid var(--glass-border);
        color: var(--glass-text);
      }

      .glass-card {
        border-radius: 10px;
      }

      .glass-card:hover {
        transform: translateY(-10px) scale(1.02);
        border-color: var(--glass-border-hover);
        box-shadow: 0 20px 40px var(--glass-shadow);
      }

      /* Text styles */
      .glass-container h1,
      .glass-container h2,
      .glass-container h3,
      .glass-container h4,
      .glass-container h5,
      .glass-container h6 {
        color: var(--glass-text);
      }

      .glass-container p,
      .glass-container span,
      .glass-text-muted {
        color: var(--glass-text-muted);
      }

      .glass-container a,
      .glass-link {
        color: var(--glass-primary);
        text-decoration: none;
        transition: color 0.3s ease;
      }

      .glass-container a:hover,
      .glass-link:hover {
        color: var(--glass-accent);
      }

      /* Button styles */
      .glass-button,
      .glass-btn {
        background: var(--glass-bg);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid var(--glass-border);
        color: var(--glass-text);
        transition: all 0.3s ease;
        cursor: pointer;
      }

      .glass-button:hover,
      .glass-btn:hover {
        background: var(--glass-bg-hover);
        border-color: var(--glass-border-hover);
        box-shadow: 0 4px 15px var(--glass-shadow);
        transform: translateY(-2px);
      }

      .glass-button:active,
      .glass-btn:active {
        transform: translateY(0);
      }

      /* Primary button variant */
      .glass-button-primary,
      .glass-btn-primary {
        background: linear-gradient(135deg, var(--glass-primary), var(--glass-secondary));
        border: 1px solid var(--glass-primary);
        color: white;
        cursor: pointer;
      }

      .glass-button-primary:hover,
      .glass-btn-primary:hover {
        box-shadow: 0 6px 20px var(--glass-shadow);
      }

      /* Input and form styles */
      .glass-input,
      .glass-textarea,
      .glass-select {
        background: var(--glass-bg);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid var(--glass-border);
        color: var(--glass-text);
        transition: all 0.3s ease;
      }

      .glass-input::placeholder,
      .glass-textarea::placeholder {
        color: var(--glass-text-muted);
        opacity: 0.7;
      }

      .glass-input:focus,
      .glass-textarea:focus,
      .glass-select:focus {
        outline: none;
        border-color: var(--glass-primary);
        box-shadow: 0 0 0 3px ${palette.primary}33;
        background: var(--glass-bg-hover);
      }

      /* Label styles */
      .glass-label {
        color: var(--glass-text);
        font-weight: 500;
      }

      /* Alert/Message styles */
      .glass-alert {
        background: var(--glass-bg);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid var(--glass-border);
        color: var(--glass-text);
      }

      .glass-alert-error {
        border-color: var(--glass-error);
        background: ${palette.error}15;
      }

      .glass-alert-success {
        border-color: var(--glass-success);
        background: ${palette.success}15;
      }

      .glass-alert-warning {
        border-color: var(--glass-warning);
        background: ${palette.warning}15;
      }

      /* Badge styles */
      .glass-badge {
        background: var(--glass-bg);
        color: white;
        font-size: 0.875em;
      }

      .glass-badge-secondary {
        background: var(--glass-secondary);
      }

      .glass-badge-accent {
        background: var(--glass-accent);
      }

      /* Divider */
      .glass-divider,
      .glass-container hr {
        border: none;
        border-top: 1px solid var(--glass-border);
        opacity: 0.5;
      }

      /* Footer */
      .glass-footer {
        padding: 30px 0;
        text-align: center;
        color: var(--glass-text);
        border-top: 1px solid var(--glass-border);
      }

      /* Utility classes */
      .glass-text-primary { color: var(--glass-primary); }
      .glass-text-secondary { color: var(--glass-secondary); }
      .glass-text-accent { color: var(--glass-accent); }
      .glass-bg-primary { background-color: var(--glass-primary); }
      .glass-bg-secondary { background-color: var(--glass-secondary); }
      .glass-bg-accent { background-color: var(--glass-accent); }
    `;

    document.head.appendChild(styleEl);
  }

  class Bubble {
    constructor() {
      this.reset();
      // Start at random position
      if (config.backgroundMode === 'absolute') {
        this.y = Math.random() * documentHeight;
      } else {
        this.y = Math.random() * viewportHeight;
      }
      this.baseY = this.y;
    }

    reset() {
      const sizeVariation = 1 + (Math.random() - 0.5) * config.bubbleSizeVariation;
      this.size = config.bubbleSize * sizeVariation;
      this.x = Math.random() * window.innerWidth;
      
      if (config.backgroundMode === 'absolute') {
        this.y = documentHeight + this.size;
      } else {
        this.y = viewportHeight + this.size;
      }
      
      this.baseX = this.x;
      this.baseY = this.y;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = -Math.random() * 0.5 - 0.5;
      this.opacity = Math.random() * 0.3 + 0.1;
      this.pulsePhase = Math.random() * Math.PI * 2;
      
      const colors = config.colorTheme === 'custom' ? 
        config.customColors : 
        colorThemes[config.colorTheme];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    isInViewport() {
      if (config.backgroundMode === 'fixed') return true;
      return this.y + this.size > scrollY && 
             this.y - this.size < scrollY + viewportHeight;
    }

    update(deltaTime) {
      // Only update if animation is enabled and bubble is near viewport
      if (config.backgroundMode === 'absolute' && config.animateOnlyInViewport && !this.isInViewport()) {
        // Simple position update for off-screen bubbles
        this.baseY += this.vy * config.animationSpeed / 100 * deltaTime * 60;
        if (this.baseY < -this.size) {
          this.reset();
        }
        return;
      }

      // Base movement
      const speedFactor = config.animationSpeed / 100;
      this.baseY += this.vy * speedFactor * deltaTime * 60;
      this.baseX += this.vx * speedFactor * deltaTime * 60;

      // Mouse influence
      if (config.mouseInteraction) {
        const adjustedMouseY = config.backgroundMode === 'absolute' ? mouseY + scrollY : mouseY;
        const dx = mouseX - this.baseX;
        const dy = adjustedMouseY - this.baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 300;
        
        if (distance < maxDistance) {
          const influence = (1 - distance / maxDistance) * config.mouseInfluence;
          this.x = this.baseX + dx * influence;
          this.y = this.baseY + dy * influence;
        } else {
          this.x = this.baseX;
          this.y = this.baseY;
        }
      } else {
        this.x = this.baseX;
        this.y = this.baseY;
      }

      // Pulse animation
      if (config.pulseAnimation) {
        this.pulsePhase += config.pulseSpeed * 0.02 * deltaTime;
      }

      // Reset bubble when it goes off screen
      if (this.baseY < -this.size || this.baseX < -this.size || this.baseX > window.innerWidth + this.size) {
        this.reset();
      }

      // Subtle drift
      this.vx += (Math.random() - 0.5) * 0.01 * speedFactor;
      this.vx = Math.max(-1, Math.min(1, this.vx));
    }

    draw() {
      // Only draw if bubble is in or near viewport
      if (config.backgroundMode === 'absolute' && !this.isInViewport()) return;

      const pulseFactor = config.pulseAnimation ? 
        1 + Math.sin(this.pulsePhase) * 0.1 : 
        1;
      
      const currentSize = this.size * pulseFactor;

      // Create gradient
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, currentSize
      );

      // Parse hex color to RGB for manipulation
      const r = parseInt(this.color.slice(1, 3), 16);
      const g = parseInt(this.color.slice(3, 5), 16);
      const b = parseInt(this.color.slice(5, 7), 16);

      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.opacity})`);
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${this.opacity * 0.5})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
      ctx.fill();

      // Glow effect
      if (config.glowIntensity > 0) {
        ctx.shadowBlur = 30 * config.glowIntensity;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }

  function getDocumentHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
  }

  function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.style.position = config.backgroundMode;
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-2';
    ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
    
    resizeCanvas();
  }

  function resizeCanvas() {
    viewportHeight = window.innerHeight;
    
    if (config.backgroundMode === 'absolute') {
      documentHeight = getDocumentHeight();
      const effectiveHeight = Math.min(documentHeight, config.maxCanvasHeight);
      canvas.width = window.innerWidth;
      canvas.height = effectiveHeight;
      canvas.style.height = documentHeight + 'px';
      
      // Auto-adjust bubble count based on page height if enabled
      if (config.useAutoBubbleCount) {
        const calculatedCount = Math.floor(documentHeight * config.bubbleDensity);
        const maxBubbles = getMaxBubblesForPerformance();
        config.bubbleCount = Math.min(Math.max(5, calculatedCount), maxBubbles);
        
        if (Math.abs(bubbles.length - config.bubbleCount) > 2) {
          initBubbles();
        }
      }
    } else {
      canvas.width = window.innerWidth;
      canvas.height = viewportHeight;
      canvas.style.height = '100%';
    }
  }

  function getMaxBubblesForPerformance() {
    if (config.performanceMode === 'high') return 50;
    if (config.performanceMode === 'low') return 10;
    if (config.performanceMode === 'balanced') return 25;
    
    // Auto mode: adjust based on document height (only relevant for absolute mode)
    if (config.backgroundMode === 'absolute' && documentHeight) {
      if (documentHeight < 2000) return 30;
      if (documentHeight < 5000) return 20;
      return 15;
    }
    
    return 25; // Default for fixed mode
  }

  function createGlassLayer() {
    const glassLayer = document.createElement('div');
    glassLayer.id = 'glassmorphic-layer';
    
    const height = config.backgroundMode === 'absolute' ? `${documentHeight}px` : '100%';
    
    glassLayer.style.cssText = `
      position: ${config.backgroundMode};
      top: 0;
      left: 0;
      width: 100%;
      height: ${height};
      pointer-events: none;
      z-index: -1;
      backdrop-filter: blur(${config.blurIntensity}px);
      -webkit-backdrop-filter: blur(${config.blurIntensity}px);
      background: rgba(255, 255, 255, ${config.glassOpacity});
    `;
    document.body.appendChild(glassLayer);
  }

  function createBackgroundGradient() {
    const colors = config.colorTheme === 'custom' ? 
      config.customColors : 
      colorThemes[config.colorTheme];
    
    const gradientStops = colors.map((color, i) => 
      `${color} ${(i / (colors.length - 1)) * 100}%`
    ).join(', ');
    
    if (config.backgroundMode === 'absolute') {
      // Create a wrapper div for the gradient that extends full height
      const existingBg = document.getElementById('glassmorphic-gradient');
      if (existingBg) existingBg.remove();
      
      const gradientBg = document.createElement('div');
      gradientBg.id = 'glassmorphic-gradient';
      gradientBg.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: ${documentHeight}px;
        background: linear-gradient(${config.gradientAngle}deg, ${gradientStops});
        z-index: -3;
      `;
      document.body.insertBefore(gradientBg, document.body.firstChild);
      
      // Ensure body has proper styling
      document.body.style.position = 'relative';
      document.body.style.minHeight = '100vh';
      document.body.style.margin = '0';
    } else {
      // Fixed mode: apply gradient directly to body
      document.body.style.background = `linear-gradient(${config.gradientAngle}deg, ${gradientStops})`;
      document.body.style.backgroundAttachment = 'fixed';
      document.body.style.minHeight = '100vh';
      document.body.style.margin = '0';
    }
  }

  function createNoiseTexture() {
    if (config.noiseOpacity <= 0) return;

    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = 128;
    noiseCanvas.height = 128;
    const noiseCtx = noiseCanvas.getContext('2d');
    
    const imageData = noiseCtx.createImageData(128, 128);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 255;
      data[i] = noise;     // R
      data[i + 1] = noise; // G
      data[i + 2] = noise; // B
      data[i + 3] = 255;   // A
    }
    
    noiseCtx.putImageData(imageData, 0, 0);
    
    const noiseOverlay = document.createElement('div');
    noiseOverlay.id = 'glassmorphic-noise';
    
    const height = config.backgroundMode === 'absolute' ? `${documentHeight}px` : '100%';
    
    noiseOverlay.style.cssText = `
      position: ${config.backgroundMode};
      top: 0;
      left: 0;
      width: 100%;
      height: ${height};
      pointer-events: none;
      z-index: -1;
      opacity: ${config.noiseOpacity};
      background-image: url(${noiseCanvas.toDataURL()});
      background-repeat: repeat;
      mix-blend-mode: overlay;
    `;
    document.body.appendChild(noiseOverlay);
  }

  function updateElementHeights() {
    if (config.backgroundMode !== 'absolute') return;
    
    documentHeight = getDocumentHeight();
    
    // Update gradient background
    const gradientBg = document.getElementById('glassmorphic-gradient');
    if (gradientBg) gradientBg.style.height = documentHeight + 'px';
    
    // Update glass layer
    const glassLayer = document.getElementById('glassmorphic-layer');
    if (glassLayer) glassLayer.style.height = documentHeight + 'px';
    
    // Update noise overlay
    const noiseOverlay = document.getElementById('glassmorphic-noise');
    if (noiseOverlay) noiseOverlay.style.height = documentHeight + 'px';
    
    // Update canvas
    resizeCanvas();
  }

  function initBubbles() {
    bubbles = [];
    for (let i = 0; i < config.bubbleCount; i++) {
      bubbles.push(new Bubble());
    }
  }

  let lastTime = 0;
  function animate(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
    lastTime = currentTime;
    time += deltaTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    bubbles.forEach(bubble => {
      bubble.update(deltaTime);
      bubble.draw();
    });
    
    if (config.animationSpeed > 0) {
      animationId = requestAnimationFrame(animate);
    }
  }

  function handleMouseMove(e) {
    if (config.mouseInteraction) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }
  }

  function handleScroll() {
    scrollY = window.pageYOffset || document.documentElement.scrollTop;
  }

  function handleResize() {
    if (config.backgroundMode === 'absolute') {
      updateElementHeights();
    } else {
      resizeCanvas();
    }
  }

  function setupResizeObserver() {
    if (config.backgroundMode === 'absolute' && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          if (entry.target === document.body) {
            updateElementHeights();
          }
        }
      });
      resizeObserver.observe(document.body);
    }
  }

  function init(userConfig = {}) {
    // Merge configurations
    config = { ...defaultConfig, ...userConfig };
    
    // Validate config
    config.animationSpeed = Math.max(0, Math.min(100, config.animationSpeed));
    config.bubbleCount = Math.max(1, Math.min(50, config.bubbleCount));
    config.blurIntensity = Math.max(0, Math.min(50, config.blurIntensity));
    config.glassOpacity = Math.max(0, Math.min(1, config.glassOpacity));
    
    // Clean up any existing elements
    destroy();
    
    // Get initial dimensions
    viewportHeight = window.innerHeight;
    if (config.backgroundMode === 'absolute') {
      documentHeight = getDocumentHeight();
      scrollY = window.pageYOffset || document.documentElement.scrollTop;
    }
    
    // Create elements
    createBackgroundGradient();
    createCanvas();
    createGlassLayer();
    createNoiseTexture();
    applyThemeStyles();
    initBubbles();
    
    // Setup resize observer for dynamic content (absolute mode only)
    setupResizeObserver();
    
    // Event listeners
    if (config.mouseInteraction) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    window.addEventListener('resize', handleResize);
    
    if (config.backgroundMode === 'absolute') {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    // Start animation
    if (config.animationSpeed > 0) {
      lastTime = performance.now();
      animate(lastTime);
    } else {
      // Draw static bubbles
      bubbles.forEach(bubble => bubble.draw());
    }
  }

  function destroy() {
    // Cancel animation
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    
    // Remove resize observer
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    
    // Remove elements
    const elementsToRemove = [
      'canvas[style*="z-index: -2"]',
      '#glassmorphic-gradient',
      '#glassmorphic-layer',
      '#glassmorphic-noise',
      '#glassmorphic-theme-styles'
    ];
    
    elementsToRemove.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) element.remove();
    });
    
    // Remove event listeners
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('scroll', handleScroll);
    
    // Reset body styles
    document.body.style.background = '';
    document.body.style.backgroundAttachment = '';
    document.body.style.position = '';
    document.body.style.minHeight = '';
    document.body.style.margin = '';
  }

  function updateConfig(newConfig) {
    init({ ...config, ...newConfig });
  }

  // Public API
  return {
    init,
    destroy,
    updateConfig,
    getConfig: () => ({ ...config }),
    getThemes: () => Object.keys(colorThemes),
    
    // Convenience methods for switching modes
    setFixed: () => updateConfig({ backgroundMode: 'fixed' }),
    setAbsolute: () => updateConfig({ backgroundMode: 'absolute' }),
    toggleMode: () => updateConfig({ 
      backgroundMode: config.backgroundMode === 'fixed' ? 'absolute' : 'fixed' 
    })
  };
})();

// Auto-initialize with default settings if no config is provided
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.glassmorphicConfig !== 'undefined') {
      ThemeGenerator.init(window.glassmorphicConfig);
    }
  });
} else {
  if (typeof window.glassmorphicConfig !== 'undefined') {
    ThemeGenerator.init(window.glassmorphicConfig);
  }
}