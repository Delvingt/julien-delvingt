/**
 * Thème Néons - Script JavaScript
 * Une expérience visuelle immersive avec des effets dynamiques et des animations néon
 * 
 * Structure modulaire avec séparation claire des responsabilités :
 * - Configuration centralisée
 * - Modules d'effets indépendants
 * - Initialisation séquentielle
 */

// Attendre que le DOM soit chargé pour initialiser le thème
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser le thème néon
    NeonTheme.init();
});

// Configuration globale
const NEON_CONFIG = {
    colors: {
        primary: '#ff00ff',   // Magenta
        secondary: '#00ffff', // Cyan
        tertiary: '#00ff00',  // Vert
        accent: '#ff3377',    // Rose
        yellow: '#ffcc00'     // Jaune
    },
    particles: {
        count: 80,
        maxSize: 4,
        speed: {
            min: 0.5,
            max: 2
        },
        opacity: {
            min: 0.3,
            max: 0.7
        }
    },
    gridLines: {
        enabled: true,
        size: 30,
        opacity: 0.1
    },
    waveEffect: {
        enabled: true,
        speed: 5,
        height: 120
    },
    features: {
        textFlicker: true,
        hoverEffects: true,
        backgroundEffects: true,
        scanlines: true,
        mouseMoveEffect: true
    }
};

// Utilitaires
const NeonUtils = {
    /**
     * Génère une couleur néon aléatoire à partir de la palette de configuration
     */
    getRandomNeonColor: function() {
        const colors = Object.values(NEON_CONFIG.colors);
        return colors[Math.floor(Math.random() * colors.length)];
    },
    
    /**
     * Calcule une variation de couleur pour les effets de pulsation
     */
    getColorVariation: function(hexColor, amount) {
        // Parse la couleur hex en RGB
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        
        // Ajuste les valeurs
        const newR = Math.min(255, Math.max(0, r + amount));
        const newG = Math.min(255, Math.max(0, g + amount));
        const newB = Math.min(255, Math.max(0, b + amount));
        
        // Convertit en hex et retourne
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    },
    
    /**
     * Crée un identifiant unique pour les animations CSS
     */
    generateUniqueId: function(prefix = 'neon') {
        return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
    },
    
    /**
     * Crée et injecte des règles CSS dynamiquement
     */
    injectCSS: function(css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
        return style;
    }
};

// Module de gestion des effets de texte néon
const TextEffectsManager = {
    /**
     * Applique des effets de lueur à différents éléments textuels
     */
    applyNeonTextEffects: function() {
        // Éléments qui doivent avoir un effet de lueur
        const glowElements = [
            { selector: '.navbar-brand', colorKey: 'primary' },
            { selector: '.section-title', colorKey: 'secondary' },
            { selector: '.card-title', colorKey: 'tertiary' },
            { selector: '.stat-number', colorKey: 'accent' }
        ];
        
        glowElements.forEach(item => {
            const elements = document.querySelectorAll(item.selector);
            const color = NEON_CONFIG.colors[item.colorKey];
            
            elements.forEach(element => {
                element.classList.add('neon-glow');
                element.dataset.glowColor = color;
                
                if (NEON_CONFIG.features.textFlicker) {
                    this.applyColorPulse(element, color);
                }
            });
        });
    },
    
    /**
     * Anime la couleur et l'intensité de la lueur du texte
     */
    applyColorPulse: function(element, baseColor) {
        // Créer une animation CSS personnalisée
        const keyframeId = NeonUtils.generateUniqueId('pulse');
        const brightColor = NeonUtils.getColorVariation(baseColor, 20);
        
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes ${keyframeId} {
                0% {
                    text-shadow: 0 0 5px ${baseColor}, 0 0 10px ${baseColor};
                }
                50% {
                    text-shadow: 0 0 10px ${brightColor}, 0 0 20px ${baseColor}, 0 0 30px ${baseColor};
                }
                100% {
                    text-shadow: 0 0 5px ${baseColor}, 0 0 10px ${baseColor};
                }
            }
        `;
        document.head.appendChild(style);
        
        // Appliquer l'animation avec un délai aléatoire
        const animationDuration = 2 + Math.random() * 3;
        const animationDelay = Math.random() * 2;
        
        element.style.animation = `${keyframeId} ${animationDuration}s infinite`;
        element.style.animationDelay = `${animationDelay}s`;
    },
    
    /**
     * Applique un effet de scintillement à certains éléments textuels
     */
    initTextFlicker: function() {
        if (!NEON_CONFIG.features.textFlicker) return;
        
        // Sélectionner des éléments aléatoires pour l'effet de scintillement
        const titles = document.querySelectorAll('.card-title, .section-title');
        const flickerElements = Array.from(titles).filter(() => Math.random() < 0.3);
        
        flickerElements.forEach(element => {
            this.applyTextFlicker(element);
        });
    },
    
    /**
     * Applique un effet de scintillement à un élément spécifique
     */
    applyTextFlicker: function(element) {
        // Fonction de scintillement avec probabilité variable
        const flicker = () => {
            if (Math.random() < 0.97) return; // Scintillement rare
            
            // Probabilité de scintillement complet vs partiel
            element.style.opacity = Math.random() < 0.2 ? '0.7' : '1';
            
            // Durée aléatoire du scintillement
            setTimeout(() => {
                element.style.opacity = '1';
            }, 50 + Math.random() * 150);
        };
        
        // Démarrer l'animation de scintillement
        const flickerInterval = setInterval(flicker, 500);
        
        // Stocker l'ID de l'intervalle pour le nettoyage
        element.dataset.flickerInterval = flickerInterval;
    }
};

// Module de gestion des effets de cartes
const CardEffectsManager = {
    /**
     * Applique les effets néon aux cartes de service
     */
    applyCardEffects: function() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            card.classList.add('neon-card');
            this.createCardBorderEffect(card);
            
            // Animation d'entrée au chargement
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
        });
        
        // Animation séquentielle des cartes
        this.animateCardsSequentially(serviceCards);
    },
    
    /**
     * Anime les cartes séquentiellement avec un délai
     */
    animateCardsSequentially: function(cards) {
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 + index * 120);
        });
    },
    
    /**
     * Crée l'effet de bordure néon sur les cartes
     */
    createCardBorderEffect: function(card) {
        // Créer un élément pour la bordure lumineuse
        const borderGlow = document.createElement('div');
        borderGlow.className = 'card-border-glow';
        
        // Appliquer un style CSS pour l'effet de bordure
        borderGlow.style.cssText = `
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            border-radius: 10px;
            z-index: -1;
            opacity: 0;
            transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
        `;
        
        // Ajouter l'élément de bordure à la carte
        card.style.position = 'relative';
        card.appendChild(borderGlow);
        
        // Ajouter les gestionnaires d'événements
        card.addEventListener('mouseenter', function() {
            const randomColor = NeonUtils.getRandomNeonColor();
            borderGlow.style.boxShadow = `0 0 15px ${randomColor}, 0 0 25px ${randomColor}`;
            borderGlow.style.opacity = '1';
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            borderGlow.style.opacity = '0';
            card.style.transform = 'translateY(0) scale(1)';
        });
    }
};

// Module de gestion des effets d'arrière-plan
const BackgroundEffectsManager = {
    backgroundContainer: null,
    mouseX: 0,
    mouseY: 0,
    
    /**
     * Initialise les différents effets d'arrière-plan
     */
    init: function() {
        if (!NEON_CONFIG.features.backgroundEffects) return;
        
        // Créer le conteneur pour les effets d'arrière-plan
        this.createBackgroundContainer();
        
        // Ajouter les différents effets d'arrière-plan
        this.createParticles();
        this.createGridEffect();
        this.createWaveEffect();
        this.createScanlineEffect();
        this.initMouseMoveEffect();
    },
    
    /**
     * Crée le conteneur principal pour les effets d'arrière-plan
     */
    createBackgroundContainer: function() {
        const container = document.createElement('div');
        container.className = 'neon-background-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
            z-index: -10;
        `;
        
        document.body.appendChild(container);
        this.backgroundContainer = container;
        
        // Ajouter un effet de "bruit" pour un look plus dynamique
        this.createNoiseEffect();
    },
    
    /**
     * Crée un effet de bruit/texture sur le fond
     */
    createNoiseEffect: function() {
        const noiseEffect = document.createElement('div');
        noiseEffect.className = 'neon-noise-effect';
        noiseEffect.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -5;
            opacity: 0.02;
            background-image: url('data:image/png;base64,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');
        `;
        
        this.backgroundContainer.appendChild(noiseEffect);
    },
    
    /**
     * Crée des particules animées en arrière-plan
     */
    createParticles: function() {
        const particleCount = NEON_CONFIG.particles.count;
        
        // Ajouter une animation CSS pour les particules
        const particleStyle = document.createElement('style');
        particleStyle.id = 'neon-particle-style';
        particleStyle.innerHTML = `
            @keyframes float-particle {
                0%, 100% {
                    transform: translate(0, 0);
                }
                25% {
                    transform: translate(-30px, -30px);
                }
                50% {
                    transform: translate(40px, -50px);
                }
                75% {
                    transform: translate(25px, 25px);
                }
            }
            
            @keyframes pulse-particle {
                0%, 100% {
                    opacity: 0.2;
                    transform: scale(0.8);
                }
                50% {
                    opacity: 0.8;
                    transform: scale(1.2);
                }
            }
        `;
        document.head.appendChild(particleStyle);
        
        // Créer le conteneur de particules
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'neon-particles-container';
        particlesContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -8;
        `;
        
        this.backgroundContainer.appendChild(particlesContainer);
        
        // Créer les particules
        for (let i = 0; i < particleCount; i++) {
            this.createSingleParticle(particlesContainer);
        }
    },
    
    /**
     * Crée une particule individuelle avec des propriétés aléatoires
     */
    createSingleParticle: function(container) {
        const particle = document.createElement('div');
        const config = NEON_CONFIG.particles;
        const size = 1 + Math.random() * config.maxSize;
        
        // Position aléatoire
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Type de particule (statique, flottante ou pulsante)
        const particleType = Math.random() < 0.7 ? 'float' : (Math.random() < 0.5 ? 'pulse' : 'static');
        
        // Animation selon le type
        let animation = '';
        if (particleType === 'float') {
            const animationDuration = 15 + Math.random() * 30;
            const delay = Math.random() * 10;
            animation = `float-particle ${animationDuration}s infinite ease-in-out ${-delay}s`;
        } else if (particleType === 'pulse') {
            const animationDuration = 2 + Math.random() * 4;
            const delay = Math.random() * 2;
            animation = `pulse-particle ${animationDuration}s infinite ease-in-out ${-delay}s`;
        }
        
        // Couleur et opacité
        const color = NeonUtils.getRandomNeonColor();
        const opacity = config.opacity.min + Math.random() * (config.opacity.max - config.opacity.min);
        
        // Appliquer les styles
        particle.className = 'neon-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background-color: ${color};
            box-shadow: 0 0 ${size * 2}px ${color};
            top: ${posY}%;
            left: ${posX}%;
            opacity: ${opacity};
            animation: ${animation};
            pointer-events: none;
        `;
        
        container.appendChild(particle);
    },
    
    /**
     * Crée un effet de grille néon en arrière-plan
     */
    createGridEffect: function() {
        if (!NEON_CONFIG.gridLines.enabled) return;
        
        const gridContainer = document.createElement('div');
        gridContainer.className = 'neon-grid-container';
        gridContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -9;
            perspective: 1000px;
            transform-style: preserve-3d;
        `;
        
        // Créer l'animation pour la grille
        const gridId = NeonUtils.generateUniqueId('grid');
        const gridStyle = document.createElement('style');
        gridStyle.innerHTML = `
            @keyframes ${gridId}-horizontal {
                0% {
                    transform: translateZ(0px);
                }
                100% {
                    transform: translateZ(50px);
                }
            }
            
            @keyframes ${gridId}-vertical {
                0% {
                    transform: translateZ(0px);
                }
                100% {
                    transform: translateZ(30px);
                }
            }
        `;
        document.head.appendChild(gridStyle);
        
        // Créer les lignes horizontales
        const gridSize = NEON_CONFIG.gridLines.size;
        const opacity = NEON_CONFIG.gridLines.opacity;
        const horizontalLines = Math.ceil(window.innerHeight / gridSize) + 1;
        
        for (let i = 0; i < horizontalLines; i++) {
            const line = document.createElement('div');
            line.className = 'neon-grid-line horizontal';
            line.style.cssText = `
                position: absolute;
                left: 0;
                width: 100%;
                height: 1px;
                top: ${i * gridSize}px;
                background: linear-gradient(90deg, 
                    transparent 0%, 
                    ${NEON_CONFIG.colors.secondary} 20%, 
                    ${NEON_CONFIG.colors.secondary} 80%, 
                    transparent 100%);
                opacity: ${opacity};
                transform: translateZ(0);
                animation: ${gridId}-horizontal 10s infinite alternate ease-in-out;
                animation-delay: ${i * 0.1}s;
            `;
            gridContainer.appendChild(line);
        }
        
        // Créer les lignes verticales
        const verticalLines = Math.ceil(window.innerWidth / gridSize) + 1;
        
        for (let i = 0; i < verticalLines; i++) {
            const line = document.createElement('div');
            line.className = 'neon-grid-line vertical';
            line.style.cssText = `
                position: absolute;
                top: 0;
                height: 100%;
                width: 1px;
                left: ${i * gridSize}px;
                background: linear-gradient(0deg, 
                    transparent 0%, 
                    ${NEON_CONFIG.colors.primary} 20%, 
                    ${NEON_CONFIG.colors.primary} 80%, 
                    transparent 100%);
                opacity: ${opacity};
                transform: translateZ(0);
                animation: ${gridId}-vertical 8s infinite alternate ease-in-out;
                animation-delay: ${i * 0.1}s;
            `;
            gridContainer.appendChild(line);
        }
        
        this.backgroundContainer.appendChild(gridContainer);
    },
    
    /**
     * Crée un effet de vagues lumineuses animées
     */
    createWaveEffect: function() {
        if (!NEON_CONFIG.waveEffect.enabled) return;
        
        const waveContainer = document.createElement('div');
        waveContainer.className = 'neon-wave-container';
        waveContainer.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: ${NEON_CONFIG.waveEffect.height}px;
            z-index: -7;
            overflow: hidden;
        `;
        
        // Créer plusieurs vagues avec différentes couleurs et vitesses
        const waveColors = [
            NEON_CONFIG.colors.primary,
            NEON_CONFIG.colors.secondary,
            NEON_CONFIG.colors.tertiary
        ];
        
        waveColors.forEach((color, index) => {
            this.createSingleWave(waveContainer, color, index);
        });
        
        this.backgroundContainer.appendChild(waveContainer);
    },
    
    /**
     * Crée une seule vague animée
     */
    createSingleWave: function(container, color, index) {
        const wave = document.createElement('div');
        wave.className = 'neon-wave';
        
        const baseSpeed = NEON_CONFIG.waveEffect.speed;
        const speed = baseSpeed + (index * 2);
        const height = 40 + (index * 15);
        const delay = index * 0.5;
        const opacity = 0.1 - (index * 0.02);
        
        // Générer un identifiant unique pour l'animation
        const waveId = NeonUtils.generateUniqueId('wave');
        
        // Créer l'animation CSS pour cette vague
        const waveStyle = document.createElement('style');
        waveStyle.innerHTML = `
            @keyframes ${waveId} {
                0% {
                    transform: translateX(-50%) translateZ(0) scaleY(1);
                }
                50% {
                    transform: translateX(-40%) translateZ(0) scaleY(0.8);
                }
                100% {
                    transform: translateX(-30%) translateZ(0) scaleY(1);
                }
            }
        `;
        document.head.appendChild(waveStyle);
        
        wave.style.cssText = `
            position: absolute;
            bottom: ${index * 15}px;
            left: 50%;
            width: 200%;
            height: ${height}px;
            background: linear-gradient(0deg, transparent 0%, ${color} 100%);
            opacity: ${opacity};
            border-radius: 100%;
            transform-origin: 50% 100%;
            animation: ${waveId} ${speed}s infinite ease-in-out;
            animation-delay: ${delay}s;
        `;
        
        container.appendChild(wave);
    },
    
    /**
     * Crée un effet de lignes de balayage (scanlines)
     */
    createScanlineEffect: function() {
        if (!NEON_CONFIG.features.scanlines) return;
        
        const scanlines = document.createElement('div');
        scanlines.className = 'neon-scanlines';
        scanlines.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                to bottom,
                transparent 50%,
                rgba(0, 0, 0, 0.1) 51%,
                transparent 51%
            );
            background-size: 100% 4px;
            z-index: -2;
            pointer-events: none;
            opacity: 0.15;
        `;
        
        this.backgroundContainer.appendChild(scanlines);
    },
    
    /**
     * Initialise l'effet de mouvement réactif à la souris
     */
    initMouseMoveEffect: function() {
        if (!NEON_CONFIG.features.mouseMoveEffect) return;
        
        // Créer le conteneur pour l'effet de mouvement
        const moveEffect = document.createElement('div');
        moveEffect.className = 'neon-mouse-effect';
        moveEffect.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -6;
            background: radial-gradient(
                circle 200px at 50% 50%,
                rgba(255, 0, 255, 0.03),
                transparent
            );
            pointer-events: none;
            opacity: 0;
            transition: opacity 1s ease;
        `;
        
        this.backgroundContainer.appendChild(moveEffect);
        
        // Enregistrer la position de la souris
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            moveEffect.style.opacity = '1';
            moveEffect.style.background = `radial-gradient(
                circle 200px at ${this.mouseX}px ${this.mouseY}px,
                rgba(255, 0, 255, 0.05),
                transparent
            )`;
        });
        
        // Animation pour l'effet de traînée
        let lastX = 0;
        let lastY = 0;
        
        const updateMouseEffect = () => {
            // Créer un effet de suivi fluide
            lastX += (this.mouseX - lastX) * 0.1;
            lastY += (this.mouseY - lastY) * 0.1;
            
            moveEffect.style.background = `radial-gradient(
                circle 200px at ${lastX}px ${lastY}px,
                rgba(255, 0, 255, 0.05),
                transparent
            )`;
            
            requestAnimationFrame(updateMouseEffect);
        };
        
        updateMouseEffect();
    }
};

// Module de gestion des effets de survol
const HoverEffectsManager = {
    /**
     * Initialise les effets de survol pour différents éléments
     */
    init: function() {
        if (!NEON_CONFIG.features.hoverEffects) return;
        
        this.initButtonsHoverEffects();
        this.initLinksHoverEffects();
        this.initStatusIndicatorsEffects();
    },
    
    /**
     * Applique des effets de survol aux boutons
     */
    initButtonsHoverEffects: function() {
        // Appliquer des effets de survol aux boutons
        const buttons = document.querySelectorAll('.card-link, .view-btn, .navbar-config-btn, button');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                
                // Obtenir la couleur de fond actuelle
                const computedStyle = window.getComputedStyle(this);
                const bgColor = computedStyle.backgroundColor;
                
                // Augmenter la lueur au survol
                this.dataset.originalShadow = this.style.boxShadow;
                this.style.boxShadow = `0 0 10px ${bgColor}, 0 0 20px ${bgColor}`;
                this.style.transform = 'scale(1.05)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.boxShadow = this.dataset.originalShadow || '';
                this.style.transform = 'scale(1)';
            });
        });
    },
    
    /**
     * Applique des effets de survol aux liens
     */
    initLinksHoverEffects: function() {
        // Effet de survol sur les onglets et les liens de navigation
        document.querySelectorAll('a, .view-btn').forEach(item => {
            if (!item.classList.contains('card-link') && !item.classList.contains('navbar-brand')) {
                item.addEventListener('mouseenter', function() {
                    this.style.transition = 'all 0.3s ease';
                    this.style.textShadow = `0 0 8px ${NEON_CONFIG.colors.primary}`;
                });
                
                item.addEventListener('mouseleave', function() {
                    this.style.textShadow = '';
                });
            }
        });
    },
    
    /**
     * Anime les indicateurs de statut en ligne
     */
    initStatusIndicatorsEffects: function() {
        document.querySelectorAll('.status-online').forEach(status => {
            if (!status.dataset.pulsating) {
                status.dataset.pulsating = 'true';
                
                // Simuler une pulsation pour les indicateurs de statut en ligne
                setInterval(() => {
                    status.style.transition = 'all 1s ease-in-out';
                    
                    if (Math.random() > 0.7) {
                        status.style.boxShadow = `0 0 10px ${NEON_CONFIG.colors.tertiary}, 0 0 15px ${NEON_CONFIG.colors.tertiary}`;
                        setTimeout(() => {
                            status.style.boxShadow = `0 0 5px ${NEON_CONFIG.colors.tertiary}`;
                        }, 200);
                    }
                }, 2000);
            }
        });
        
        // Observer les modifications du DOM pour animer les nouveaux indicateurs de statut
        const observer = new MutationObserver(() => {
            this.initStatusIndicatorsEffects();
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }
};

// Module de création de notifications
const NotificationsManager = {
    /**
     * Affiche une notification toast en bas à droite de l'écran
     */
    showToast: function(title, message, icon = 'lightbulb') {
        const toastContainer = document.querySelector('.toast-container') || this.createToastContainer();
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Supprimer le toast après 5 secondes
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 5000);
    },
    
    /**
     * Crée un conteneur pour les notifications toast s'il n'existe pas
     */
    createToastContainer: function() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
        `;
        document.body.appendChild(container);
        return container;
    },
    
    /**
     * Affiche un message de bienvenue pour le thème néon
     */
    showWelcomeMessage: function() {
        setTimeout(() => {
            this.showToast(
                'Thème Néons activé!', 
                'Bienvenue dans l\'ambiance électrisante!', 
                'lightbulb'
            );
        }, 1000);
    }
};

// Module principal pour l'initialisation du thème
const NeonTheme = {
    /**
     * Initialisation principale du thème
     */
    init: function() {
        console.log('🌈 Initialisation du Thème Néons');
        
        // Ajouter la classe au body pour activer les transitions
        document.body.classList.add('neon-theme-active');
        
        // Initialiser les différents modules d'effets
        this.initModules();
        
        // Gérer les configurations du thème
        this.setupThemeConfiguration();
        
        // Afficher le message de bienvenue
        NotificationsManager.showWelcomeMessage();
        
        console.log('🌈 Thème Néons activé avec succès');
    },
    
    /**
     * Initialise tous les modules d'effets
     */
    initModules: function() {
        // Initialiser le fond d'écran dynamique
        BackgroundEffectsManager.init();
        
        // Appliquer les effets de texte néon
        TextEffectsManager.applyNeonTextEffects();
        TextEffectsManager.initTextFlicker();
        
        // Appliquer les effets de cartes
        CardEffectsManager.applyCardEffects();
        
        // Initialiser les effets de survol
        HoverEffectsManager.init();
    },
    
    /**
     * Configure les options du thème et les interactions utilisateur
     */
    setupThemeConfiguration: function() {
        // Gérer le clic sur le bouton thème (si présent)
        const themeToggle = document.querySelector('.theme-modal-trigger');
        if (themeToggle) {
            themeToggle.addEventListener('click', function() {
                document.querySelector('.theme-modal').style.display = 'block';
            });
        }
        
        // Créer un bouton de configuration si nécessaire
        if (!themeToggle && !document.querySelector('.theme-config-button')) {
            this.createThemeConfigButton();
        }
    },
    
    /**
     * Crée un bouton de configuration du thème
     */
    createThemeConfigButton: function() {
        const configButton = document.createElement('button');
        configButton.className = 'theme-config-button';
        configButton.innerHTML = '<i class="fas fa-sliders-h"></i>';
        configButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background-color: ${NEON_CONFIG.colors.primary};
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            color: white;
            box-shadow: 0 0 10px ${NEON_CONFIG.colors.primary};
            z-index: 999;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        configButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = `0 0 20px ${NEON_CONFIG.colors.primary}`;
        });
        
        configButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = `0 0 10px ${NEON_CONFIG.colors.primary}`;
        });
        
        configButton.addEventListener('click', function() {
            NotificationsManager.showToast(
                'Configuration du thème', 
                'Les options de personnalisation seront bientôt disponibles!', 
                'cog'
            );
        });
        
        document.body.appendChild(configButton);
    }
};