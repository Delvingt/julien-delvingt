/**
 * Thème Galactique - Script JavaScript
 * Ajoute des effets dynamiques pour le thème spatial
 */

// Initialisation complète
document.addEventListener('DOMContentLoaded', function() {
    // Ajouter les animations CSS requises
    addRequiredAnimations();
    
    // Initialiser l'environnement galactique
    initGalacticEnvironment();

    // Remplacer les icônes par des icônes plus spatiales
    customizeIcons();

    // Ajouter des événements spéciaux
    initSpecialEffects();
});

// Configuration des étoiles et constellations
const config = {
    stars: {
        count: 100,
        minSize: 1,
        maxSize: 3,
        twinkleSpeed: [3, 7] // Random entre 3s et 7s
    },
    constellations: {
        count: 5,
        minStars: 5,
        maxStars: 10
    },
    shootingStars: {
        enabled: true,
        frequency: 10000, // 10 secondes
        count: 1,
        minDuration: 1000,
        maxDuration: 3000
    },
    cosmicDust: {
        enabled: true,
        count: 30
    },
    hoverEffect: true
};

/**
 * Crée un conteneur pour les éléments cosmiques (étoiles, constellations, etc.)
 */
function createCosmicContainer() {
    // Vérifier si le conteneur existe déjà
    if (document.getElementById('cosmic-container')) {
        return;
    }

    // Créer le conteneur
    const cosmicContainer = document.createElement('div');
    cosmicContainer.id = 'cosmic-container';
    cosmicContainer.style.position = 'fixed';
    cosmicContainer.style.top = '0';
    cosmicContainer.style.left = '0';
    cosmicContainer.style.width = '100%';
    cosmicContainer.style.height = '100%';
    cosmicContainer.style.pointerEvents = 'none';
    cosmicContainer.style.zIndex = '-1';
    cosmicContainer.style.overflow = 'hidden';

    // Ajouter le conteneur au body
    document.body.appendChild(cosmicContainer);
}

/**
 * Génère des étoiles aléatoires en arrière-plan
 */
function generateBackgroundStars() {
    const container = document.getElementById('cosmic-container');
    if (!container) return;
    
    for (let i = 0; i < config.stars.count; i++) {
        // Créer une étoile
        const star = document.createElement('div');
        
        // Position aléatoire
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Taille aléatoire
        const size = Math.random() * (config.stars.maxSize - config.stars.minSize) + config.stars.minSize;
        
        // Vitesse de scintillement aléatoire
        const twinkleSpeed = Math.random() * (config.stars.twinkleSpeed[1] - config.stars.twinkleSpeed[0]) + config.stars.twinkleSpeed[0];
        
        // Appliquer les styles
        star.className = 'cosmic-star';
        star.style.position = 'absolute';
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.borderRadius = '50%';
        star.style.backgroundColor = 'white';
        star.style.boxShadow = `0 0 ${size * 2}px white`;
        star.style.opacity = Math.random() * 0.5 + 0.5;
        star.style.animation = `starTwinkle ${twinkleSpeed}s infinite alternate ease-in-out`;
        star.style.animationDelay = `${Math.random() * twinkleSpeed}s`;
        
        // Ajouter l'étoile au conteneur
        container.appendChild(star);
    }
}

/**
 * Génère des constellations (groupes d'étoiles connectées par des lignes)
 */
function generateConstellations() {
    const container = document.getElementById('cosmic-container');
    if (!container) return;
    
    for (let c = 0; c < config.constellations.count; c++) {
        // Créer un conteneur pour la constellation
        const constellation = document.createElement('div');
        constellation.className = 'constellation';
        constellation.style.position = 'absolute';
        
        // Position aléatoire pour la constellation
        const centerX = Math.random() * 80 + 10; // 10% à 90% de la largeur
        const centerY = Math.random() * 80 + 10; // 10% à 90% de la hauteur
        
        constellation.style.left = `${centerX}%`;
        constellation.style.top = `${centerY}%`;
        constellation.style.width = '0';
        constellation.style.height = '0';
        
        // Nombre d'étoiles dans la constellation
        const starCount = Math.floor(Math.random() * (config.constellations.maxStars - config.constellations.minStars + 1)) + config.constellations.minStars;
        
        // Créer les points de la constellation
        const stars = [];
        for (let i = 0; i < starCount; i++) {
            // Créer une étoile
            const star = document.createElement('div');
            
            // Position relative au centre de la constellation (dans un rayon de ±100px)
            const offsetX = Math.random() * 200 - 100;
            const offsetY = Math.random() * 200 - 100;
            
            // Taille variable en fonction de la distance du centre
            const size = Math.random() * 2 + 2;
            
            // Appliquer les styles
            star.className = 'constellation-dot';
            star.style.left = `${offsetX}px`;
            star.style.top = `${offsetY}px`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            
            // Ajouter l'étoile à la constellation
            constellation.appendChild(star);
            
            // Stocker les coordonnées de l'étoile
            stars.push({ x: offsetX, y: offsetY });
        }
        
        // Créer les lignes entre les étoiles
        for (let i = 0; i < stars.length - 1; i++) {
            // Points de départ et d'arrivée
            const start = stars[i];
            const end = stars[i + 1];
            
            // Calculer la distance et l'angle
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            
            // Créer la ligne
            const line = document.createElement('div');
            line.className = 'constellation-line';
            line.style.left = `${start.x}px`;
            line.style.top = `${start.y}px`;
            line.style.width = `${distance}px`;
            line.style.transform = `rotate(${angle}deg)`;
            
            // Ajouter un délai d'animation pour un effet de dessin progressif
            line.style.animationDelay = `${i * 0.2}s`;
            
            // Ajouter la ligne à la constellation
            constellation.appendChild(line);
        }
        
        // Ajouter la constellation au conteneur
        container.appendChild(constellation);
    }
}

/**
 * Crée une étoile filante
 */
function createShootingStar() {
    const container = document.getElementById('cosmic-container');
    if (!container) return;
    
    // Créer l'élément
    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';
    
    // Position aléatoire (commence en haut et finit en bas en diagonale)
    const startX = Math.random() * 100;
    const startY = Math.random() * 30;
    
    // Angle aléatoire (de 30 à 60 degrés)
    const angle = Math.random() * 30 + 30;
    
    // Longueur aléatoire
    const length = Math.random() * 50 + 100;
    
    // Durée aléatoire
    const duration = Math.random() * (config.shootingStars.maxDuration - config.shootingStars.minDuration) + config.shootingStars.minDuration;
    
    // Appliquer les styles
    shootingStar.style.top = `${startY}%`;
    shootingStar.style.left = `${startX}%`;
    shootingStar.style.width = `${length}px`;
    shootingStar.style.transform = `rotate(${angle}deg)`;
    shootingStar.style.animationDuration = `${duration / 1000}s`;
    
    // Ajouter au conteneur
    container.appendChild(shootingStar);
    
    // Supprimer après l'animation
    setTimeout(() => {
        shootingStar.remove();
    }, duration + 100);
}

/**
 * Initialise les étoiles filantes périodiques
 */
function initShootingStars() {
    setInterval(() => {
        for (let i = 0; i < config.shootingStars.count; i++) {
            createShootingStar();
        }
    }, config.shootingStars.frequency);
    
    // Créer une étoile filante immédiatement
    setTimeout(createShootingStar, 2000);
}

/**
 * Génère des particules de poussière cosmique
 */
function generateCosmicDust() {
    const container = document.getElementById('cosmic-container');
    if (!container) return;
    
    for (let i = 0; i < config.cosmicDust.count; i++) {
        // Créer une particule de poussière
        const dust = document.createElement('div');
        
        // Position aléatoire
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Taille et opacité aléatoires
        const size = Math.random() * 50 + 50;
        const opacity = Math.random() * 0.15 + 0.05;
        
        // Couleur aléatoire
        const colors = ['#8a2be2', '#4b0082', '#e052a0', '#00c9ff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Appliquer les styles
        dust.className = 'cosmic-dust';
        dust.style.position = 'absolute';
        dust.style.left = `${x}%`;
        dust.style.top = `${y}%`;
        dust.style.width = `${size}px`;
        dust.style.height = `${size}px`;
        dust.style.borderRadius = '50%';
        dust.style.backgroundColor = color;
        dust.style.filter = 'blur(20px)';
        dust.style.opacity = opacity;
        dust.style.zIndex = '-1';
        
        // Animation de pulsation
        const duration = Math.random() * 10 + 10;
        dust.style.animation = `nebulaPulse ${duration}s infinite ease-in-out`;
        dust.style.animationDelay = `${Math.random() * duration}s`;
        
        // Ajouter la poussière au conteneur
        container.appendChild(dust);
    }
}

/**
 * Gère l'effet de parallaxe au déplacement de la souris
 * @param {MouseEvent} e - L'événement de la souris
 */
function handleMouseParallax(e) {
    const starsElements = document.querySelectorAll('.cosmic-star');
    const dustElements = document.querySelectorAll('.cosmic-dust');
    const constellations = document.querySelectorAll('.constellation');
    
    // Calculer la position relative de la souris (de -1 à 1)
    const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    const mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    
    // Appliquer un léger décalage aux étoiles
    starsElements.forEach((star) => {
        const depth = Math.random() * 0.5 + 0.5; // Profondeur aléatoire
        const translateX = mouseX * 20 * depth;
        const translateY = mouseY * 20 * depth;
        
        star.style.transform = `translate(${translateX}px, ${translateY}px)`;
    });
    
    // Déplacer les nuages de poussière plus lentement
    dustElements.forEach((dust) => {
        const depth = 0.2; // Profondeur fixe mais légère
        const translateX = mouseX * 30 * depth;
        const translateY = mouseY * 30 * depth;
        
        dust.style.transform = `translate(${translateX}px, ${translateY}px)`;
    });
    
    // Déplacer les constellations légèrement
    constellations.forEach((constellation) => {
        const depth = 0.1; // Très léger mouvement
        const translateX = mouseX * 10 * depth;
        const translateY = mouseY * 10 * depth;
        
        constellation.style.transform = `translate(${translateX}px, ${translateY}px)`;
    });
}

/**
 * Initialise l'effet de parallaxe au déplacement de la souris
 */
function initParallaxEffect() {
    document.addEventListener('mousemove', handleMouseParallax);
}

/**
 * Personnalise les icônes pour qu'elles correspondent mieux au thème galactique
 */
function customizeIcons() {
    // Remplacer certaines icônes par des icônes plus spatiales
    const iconMappings = {
        'fa-cog': 'fa-rocket',
        'fa-home': 'fa-planet-ringed',
        'fa-user': 'fa-user-astronaut',
        'fa-chart-bar': 'fa-satellite',
        'fa-bell': 'fa-meteor'
    };
    
    // Parcourir toutes les icônes et les remplacer si nécessaire
    document.querySelectorAll('i[class*="fa-"]').forEach(icon => {
        // Trouver quelle icône est utilisée
        const classNames = Array.from(icon.classList);
        const iconClass = classNames.find(className => className.startsWith('fa-'));
        
        if (iconClass && iconMappings[iconClass]) {
            // Remplacer l'icône
            icon.classList.remove(iconClass);
            icon.classList.add(iconMappings[iconClass]);
            
            // Ajouter une animation si ce n'est pas déjà fait
            if (!icon.style.animation) {
                // Animation aléatoire
                const animations = ['cosmicFloat', 'orbitAround'];
                const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
                const duration = Math.random() * 5 + 10;
                
                icon.style.animation = `${randomAnimation} ${duration}s infinite ease-in-out`;
                icon.style.animationDelay = `${Math.random() * 2}s`;
                icon.style.display = 'inline-block';
            }
        }
    });
}

/**
 * Crée un effet de supernova
 */
function createSupernova() {
    const container = document.getElementById('cosmic-container');
    if (!container) return;
    
    // Créer l'élément supernova
    const supernova = document.createElement('div');
    
    // Position aléatoire
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // Appliquer les styles
    supernova.className = 'supernova';
    supernova.style.position = 'absolute';
    supernova.style.left = `${x}%`;
    supernova.style.top = `${y}%`;
    supernova.style.width = '5px';
    supernova.style.height = '5px';
    supernova.style.borderRadius = '50%';
    supernova.style.backgroundColor = 'white';
    supernova.style.boxShadow = '0 0 30px white, 0 0 60px #00c9ff';
    supernova.style.zIndex = '0';
    supernova.style.transition = 'all 2s cubic-bezier(0.23, 1, 0.32, 1)';
    
    // Ajouter au conteneur
    container.appendChild(supernova);
    
    // Déclencher l'explosion après un court délai
    setTimeout(() => {
        supernova.style.transform = 'scale(50)';
        supernova.style.opacity = '0';
    }, 100);
    
    // Supprimer après l'animation
    setTimeout(() => {
        supernova.remove();
    }, 2100);
}

/**
 * Initialise des effets spéciaux aléatoires
 */
function initSpecialEffects() {
    // Événement aléatoire : supernova toutes les 60 secondes
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% de chance
            createSupernova();
        }
    }, 60000);
}

/**
 * Initialise l'environnement galactique
 */
function initGalacticEnvironment() {
    // Créer un conteneur pour les éléments cosmiques
    createCosmicContainer();

    // Générer les étoiles et constellations
    generateBackgroundStars();
    generateConstellations();

    // Initialiser les étoiles filantes périodiques
    if (config.shootingStars.enabled) {
        initShootingStars();
    }

    // Ajouter l'effet de poussière cosmique
    if (config.cosmicDust.enabled) {
        generateCosmicDust();
    }

    // Effet de parallaxe au déplacement de la souris
    initParallaxEffect();
}

// Ajouter les animations CSS nécessaires s'il n'existent pas déjà
function addRequiredAnimations() {
    // Vérifier si les animations existent déjà
    if (document.getElementById('galactic-animations')) return;
    
    // Créer un élément de style
    const styleElement = document.createElement('style');
    styleElement.id = 'galactic-animations';
    
    // Définir les animations
    styleElement.textContent = `
        @keyframes starTwinkle {
            0% { opacity: 0.2; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes nebulaPulse {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        @keyframes orbitAround {
            0% { transform: rotate(0deg) translateX(3px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(3px) rotate(-360deg); }
        }
        
        .shooting-star {
            position: absolute;
            height: 2px;
            background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%);
            animation: shootingStar 1s linear forwards;
            transform-origin: 0 0;
        }
        
        @keyframes shootingStar {
            0% { transform-origin: 0 0; opacity: 1; }
            70% { opacity: 1; }
            100% { transform: translateX(150vw) translateY(150vh); opacity: 0; }
        }
        
        .constellation-dot {
            position: absolute;
            background-color: white;
            border-radius: 50%;
            box-shadow: 0 0 5px white;
        }
        
        .constellation-line {
            position: absolute;
            height: 1px;
            background: linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0.5), rgba(255,255,255,0.1));
            opacity: 0.3;
            transform-origin: left center;
        }
    `;
    
    // Ajouter l'élément de style au head
    document.head.appendChild(styleElement);
}