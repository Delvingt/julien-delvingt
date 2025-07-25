/**
 * Thème Nuage - Script JavaScript
 * Ajoute des effets dynamiques pour le thème nuage
 */

// Initialisation complète
document.addEventListener('DOMContentLoaded', function() {
    // Ajouter les animations CSS requises si nécessaire
    addRequiredAnimations();
    
    // Initialiser l'environnement nuageux
    initCloudEnvironment();

    // Remplacer certaines icônes par des icônes plus adaptées au thème
    customizeIcons();

    // Ajouter des événements météo spéciaux
    initWeatherEffects();
    
    // Initialiser l'effet de parallaxe
    initParallaxEffect();
    
    // Console log d'info
    console.log("Thème Nuage initialisé ☁️");
});

// Configuration des nuages et effets météo
const config = {
    clouds: {
        count: 15,         // Augmenté de 8 à 15
        minSize: 100,      // Augmenté de 80 à 100
        maxSize: 300,      // Augmenté de 200 à 300
        speedFactor: 0.4   // Ralenti légèrement pour un effet plus doux
    },
    prominentClouds: {     // Nouveau type de nuage plus visible
        enabled: true,
        count: 6,
        minSize: 200,
        maxSize: 400
    },
    cloudShapes: {         // Nouveau type avec des formes plus complexes
        enabled: true,
        count: 8,
        types: ['cumulus', 'stratus', 'cirrus']
    },
    rain: {
        enabled: true,
        frequency: 120000, // 2 minutes
        duration: 15000,   // 15 secondes
        intensity: 0.5     // 0-1
    },
    sunrays: {
        enabled: true,
        frequency: 180000, // 3 minutes
        duration: 20000    // 20 secondes
    },
    parallax: {
        enabled: true,
        intensity: 0.08    // Augmenté pour un effet plus prononcé
    },
    rainbow: {
        enabled: true,
        frequency: 240000  // 4 minutes
    }
};

/**
 * Crée un conteneur pour les éléments météo (nuages, pluie, etc.)
 */
function createWeatherContainer() {
    // Vérifier si le conteneur existe déjà
    if (document.getElementById('weather-container')) {
        return document.getElementById('weather-container');
    }

    // Créer le conteneur
    const weatherContainer = document.createElement('div');
    weatherContainer.id = 'weather-container';
    weatherContainer.style.position = 'fixed';
    weatherContainer.style.top = '0';
    weatherContainer.style.left = '0';
    weatherContainer.style.width = '100%';
    weatherContainer.style.height = '100%';
    weatherContainer.style.pointerEvents = 'none';
    weatherContainer.style.zIndex = '-1';
    weatherContainer.style.overflow = 'hidden';

    // Ajouter le conteneur au body
    document.body.appendChild(weatherContainer);
    
    return weatherContainer;
}

/**
 * Génère des nuages flottants en arrière-plan
 */
function generateClouds() {
    const container = createWeatherContainer();
    
    // Créer plusieurs nuages avec des tailles et positions aléatoires
    for (let i = 0; i < config.clouds.count; i++) {
        // Créer un élément div pour le nuage
        const cloud = document.createElement('div');
        cloud.className = 'cloud-element';
        
        // Déterminer la taille et position aléatoire
        const size = Math.random() * (config.clouds.maxSize - config.clouds.minSize) + config.clouds.minSize;
        const top = Math.random() * 70; // % (éviter le bas de l'écran)
        const left = Math.random() * 100; // %
        
        // Vitesse et délai aléatoires
        const duration = (Math.random() * 60 + 60) / config.clouds.speedFactor; // 60-120s
        const delay = Math.random() * 30; // 0-30s
        
        // Appliquer les styles
        cloud.style.width = `${size}px`;
        cloud.style.height = `${size * 0.6}px`;
        cloud.style.top = `${top}%`;
        cloud.style.left = `${left}%`;
        cloud.style.opacity = `${Math.random() * 0.2 + 0.8}`; // 0.8-1.0 (augmenté pour plus de visibilité)
        cloud.style.filter = `blur(${size / 15}px)`; // Moins de flou pour des nuages plus définis
        
        // Ajouter un effet 3D avec des ombres
        if (Math.random() > 0.5) {
            cloud.style.boxShadow = `0 ${Math.floor(Math.random() * 10) + 5}px 25px rgba(255, 255, 255, 0.8)`;
        }
        
        // Animation
        cloud.style.animation = `cloudFloat ${duration}s ease-in-out infinite`;
        cloud.style.animationDelay = `${delay}s`;
        
        // Profondeur pour parallaxe
        cloud.setAttribute('data-depth', (Math.random() * 0.5 + 0.3).toString());
        
        // Ajouter le nuage au conteneur
        container.appendChild(cloud);
        
        // 30% de chance d'ajouter un petit nuage satellite
        if (Math.random() < 0.3) {
            const satellite = document.createElement('div');
            satellite.className = 'cloud-element';
            
            const satSize = size * (Math.random() * 0.4 + 0.3); // 30-70% de la taille du nuage parent
            const offsetX = (Math.random() * 100) - 50;
            const offsetY = (Math.random() * 60) - 30;
            
            satellite.style.width = `${satSize}px`;
            satellite.style.height = `${satSize * 0.6}px`;
            satellite.style.position = 'absolute';
            satellite.style.left = `${left + (offsetX / 100)}%`;
            satellite.style.top = `${top + (offsetY / 100)}%`;
            satellite.style.opacity = '0.9';
            satellite.style.filter = `blur(${satSize / 20}px)`;
            
            // Animation légèrement différente
            const satDuration = duration * (Math.random() * 0.4 + 0.8); // 80-120% de la durée du parent
            satellite.style.animation = `cloudFloat ${satDuration}s ease-in-out infinite`;
            satellite.style.animationDelay = `${delay + 1}s`;
            
            container.appendChild(satellite);
        }
    }
}

/**
 * Crée une forme de nuage plus élaborée
 */
function createCloudGroup() {
    const container = createWeatherContainer();
    
    // Nombre de groupes de nuages
    const groupCount = 3;
    
    for (let g = 0; g < groupCount; g++) {
        // Créer un groupe de nuages
        const cloudGroup = document.createElement('div');
        cloudGroup.className = 'cloud-group';
        cloudGroup.style.position = 'absolute';
        cloudGroup.style.zIndex = '-1';
        
        // Position aléatoire
        const top = Math.random() * 40; // Maintenir en haut
        const left = Math.random() * 100;
        
        cloudGroup.style.top = `${top}%`;
        cloudGroup.style.left = `${left}%`;
        
        // Vitesse et délai aléatoires pour le groupe entier
        const duration = Math.random() * 120 + 180; // 180-300s
        const delay = Math.random() * 60; // 0-60s
        
        // Animation du groupe entier
        cloudGroup.style.animation = `groupFloat ${duration}s ease-in-out infinite`;
        cloudGroup.style.animationDelay = `${delay}s`;
        
        // Créer 4-7 éléments de nuage dans le groupe
        const cloudParts = Math.floor(Math.random() * 4) + 4;
        
        for (let i = 0; i < cloudParts; i++) {
            const cloudPart = document.createElement('div');
            cloudPart.className = 'cloud-element';
            
            // Taille aléatoire
            const size = Math.random() * 80 + 50;
            
            // Position relative au sein du groupe
            const offsetX = Math.random() * 150 - 75;
            const offsetY = Math.random() * 50 - 25;
            
            // Appliquer les styles
            cloudPart.style.width = `${size}px`;
            cloudPart.style.height = `${size * 0.6}px`;
            cloudPart.style.position = 'absolute';
            cloudPart.style.left = `${offsetX}px`;
            cloudPart.style.top = `${offsetY}px`;
            cloudPart.style.opacity = 0.7;
            cloudPart.style.filter = `blur(${size / 15}px)`;
            
            // Animation individuelle
            cloudPart.style.animation = `cloudPulse ${Math.random() * 10 + 10}s ease-in-out infinite`;
            
            // Ajouter au groupe
            cloudGroup.appendChild(cloudPart);
        }
        
        // Ajouter le groupe au conteneur
        container.appendChild(cloudGroup);
    }
}

/**
 * Crée un effet de pluie temporaire
 */
function createRainEffect(duration = 15000) {
    const container = createWeatherContainer();
    const intensity = config.rain.intensity;
    
    // Nombre de gouttes en fonction de l'intensité
    const dropCount = Math.floor(intensity * 100);
    
    // Créer les gouttes de pluie
    const drops = [];
    
    for (let i = 0; i < dropCount; i++) {
        setTimeout(() => {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            
            // Position aléatoire
            const left = Math.random() * 100;
            
            // Vitesse et taille aléatoires
            const speed = Math.random() * 1 + 1;
            const size = Math.random() * 15 + 10;
            
            // Appliquer les styles
            drop.style.left = `${left}%`;
            drop.style.top = '-20px';
            drop.style.height = `${size}px`;
            drop.style.animation = `rainDrop ${speed}s linear infinite`;
            drop.style.animationDelay = `${Math.random() * 2}s`;
            
            // Ajouter la goutte au conteneur
            container.appendChild(drop);
            drops.push(drop);
        }, Math.random() * 2000); // Démarrage échelonné
    }
    
    // Effet sonore de pluie (optionnel)
    displayCloudToast('Météo', 'Une légère averse commence...', 'info');
    
    // Arrêter l'effet de pluie après la durée spécifiée
    setTimeout(() => {
        drops.forEach(drop => {
            drop.style.animation = 'none';
            drop.style.opacity = '0';
            setTimeout(() => drop.remove(), 1000);
        });
        
        // Notification de fin
        displayCloudToast('Météo', 'Le ciel s\'éclaircit à nouveau...', 'info');
        
    }, duration);
}

/**
 * Crée un effet de rayons de soleil
 */
function createSunraysEffect(duration = 20000) {
    const container = createWeatherContainer();
    
    // Créer 3-5 rayons de soleil
    const rayCount = Math.floor(Math.random() * 3) + 3;
    const rays = [];
    
    for (let i = 0; i < rayCount; i++) {
        const ray = document.createElement('div');
        ray.className = 'sun-ray';
        
        // Position aléatoire
        const top = Math.random() * 50;
        const left = Math.random() * 100;
        
        // Taille aléatoire
        const size = Math.random() * 200 + 100;
        
        // Appliquer les styles
        ray.style.width = `${size}px`;
        ray.style.height = `${size}px`;
        ray.style.top = `${top}%`;
        ray.style.left = `${left}%`;
        ray.style.opacity = '0';
        
        // Animation
        ray.style.animation = `sunRay ${Math.random() * 5 + 5}s ease-in-out infinite`;
        ray.style.animationDelay = `${Math.random() * 3}s`;
        
        // Ajouter le rayon au conteneur
        container.appendChild(ray);
        rays.push(ray);
        
        // Effet de transition pour l'apparition
        setTimeout(() => {
            ray.style.opacity = Math.random() * 0.3 + 0.1; // 0.1-0.4
        }, 100);
    }
    
    // Notification d'effet
    displayCloudToast('Météo', 'Des rayons de soleil percent à travers les nuages...', 'success');
    
    // Arrêter l'effet après la durée spécifiée
    setTimeout(() => {
        rays.forEach(ray => {
            // Transition de sortie
            ray.style.transition = 'opacity 2s ease';
            ray.style.opacity = '0';
            setTimeout(() => ray.remove(), 2000);
        });
    }, duration);
}

/**
 * Crée un arc-en-ciel
 */
function createRainbow() {
    const container = createWeatherContainer();
    
    // Créer l'arc-en-ciel
    const rainbow = document.createElement('div');
    rainbow.className = 'rainbow';
    
    // Appliquer les styles
    rainbow.style.position = 'absolute';
    rainbow.style.width = '200vw';
    rainbow.style.height = '200vw';
    rainbow.style.bottom = '-150vw';
    rainbow.style.left = '50%';
    rainbow.style.transform = 'translateX(-50%)';
    rainbow.style.borderRadius = '50%';
    rainbow.style.boxShadow = `
        0 0 0 10px rgba(255, 0, 0, 0.05),
        0 0 0 20px rgba(255, 165, 0, 0.05),
        0 0 0 30px rgba(255, 255, 0, 0.05),
        0 0 0 40px rgba(0, 128, 0, 0.05),
        0 0 0 50px rgba(0, 0, 255, 0.05),
        0 0 0 60px rgba(75, 0, 130, 0.05),
        0 0 0 70px rgba(238, 130, 238, 0.05)
    `;
    rainbow.style.opacity = '0';
    rainbow.style.transition = 'opacity 5s ease';
    rainbow.style.zIndex = '-2';
    
    // Ajouter l'arc-en-ciel au conteneur
    container.appendChild(rainbow);
    
    // Faire apparaître l'arc-en-ciel
    setTimeout(() => {
        rainbow.style.opacity = '1';
        
        // Notification
        displayCloudToast('Météo', 'Un arc-en-ciel apparaît à l\'horizon...', 'success');
    }, 100);
    
    // Faire disparaître l'arc-en-ciel après un certain temps
    setTimeout(() => {
        rainbow.style.opacity = '0';
        setTimeout(() => rainbow.remove(), 5000);
    }, 30000); // Visible pendant 30 secondes
}

/**
 * Initialise l'effet de parallaxe au déplacement de la souris
 */
function initParallaxEffect() {
    if (!config.parallax.enabled) return;
    
    const intensity = config.parallax.intensity;
    
    document.addEventListener('mousemove', function(e) {
        const clouds = document.querySelectorAll('.cloud-element, .cloud-group');
        
        // Position relative de la souris (-1 à 1)
        const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        const mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        
        // Déplacer les nuages en fonction de la position de la souris
        clouds.forEach(cloud => {
            // Facteur de profondeur aléatoire pour un effet 3D
            const depth = parseFloat(cloud.getAttribute('data-depth') || Math.random() * 0.5 + 0.2);
            
            // Calculer le décalage
            const moveX = mouseX * 50 * depth * intensity;
            const moveY = mouseY * 30 * depth * intensity;
            
            // Appliquer la transformation
            cloud.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
}

/**
 * Personnalise les icônes pour qu'elles correspondent mieux au thème nuage
 */
function customizeIcons() {
    // Remplacer certaines icônes par des icônes plus adaptées
    const iconMappings = {
        'fa-cogs': 'fa-cloud-sun-rain',
        'fa-server': 'fa-cloud',
        'fa-play-circle': 'fa-cloud-upload-alt',
        'fa-chart-bar': 'fa-tachometer-alt',
        'fa-bell': 'fa-cloud-sun'
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
            icon.style.animation = 'float 5s ease-in-out infinite';
            icon.style.animationDelay = `${Math.random() * 2}s`;
        }
    });
}

/**
 * Initialise des effets météo aléatoires
 */
function initWeatherEffects() {
    // Effet de pluie aléatoire
    if (config.rain.enabled) {
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% de chance
                createRainEffect(config.rain.duration);
            }
        }, config.rain.frequency);
    }
    
    // Effet de rayons de soleil aléatoire
    if (config.sunrays.enabled) {
        setInterval(() => {
            if (Math.random() < 0.4) { // 40% de chance
                createSunraysEffect(config.sunrays.duration);
            }
        }, config.sunrays.frequency);
    }
    
    // Effet d'arc-en-ciel aléatoire
    if (config.rainbow.enabled) {
        setInterval(() => {
            if (Math.random() < 0.2) { // 20% de chance
                createRainbow();
            }
        }, config.rainbow.frequency);
    }
}

/**
 * Crée un grand nuage visible et détaillé
 */
function createDetailedCloud(x, y, size, container) {
    // Créer le groupe de nuage
    const cloudGroup = document.createElement('div');
    cloudGroup.style.position = 'absolute';
    cloudGroup.style.top = `${y}%`;
    cloudGroup.style.left = `${x}%`;
    cloudGroup.style.width = `${size}px`;
    cloudGroup.style.height = `${size * 0.6}px`;
    cloudGroup.style.zIndex = '-1';
    cloudGroup.className = 'cloud-enter';
    
    // Créer le corps principal du nuage
    const mainCloud = document.createElement('div');
    mainCloud.className = 'prominent-cloud';
    mainCloud.style.width = '100%';
    mainCloud.style.height = '100%';
    mainCloud.style.position = 'absolute';
    mainCloud.style.top = '0';
    mainCloud.style.left = '0';
    
    // Ajouter 3-6 bulles supplémentaires pour donner une forme de nuage plus réaliste
    const bubbleCount = Math.floor(Math.random() * 4) + 3;
    
    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'cloud-element';
        
        // Calculer position relative
        const angle = (i / bubbleCount) * Math.PI;
        const radius = size * 0.4;
        const offsetX = Math.cos(angle) * radius;
        const offsetY = Math.sin(angle) * radius * 0.5;
        
        const bubbleSize = size * (Math.random() * 0.3 + 0.4);
        
        bubble.style.width = `${bubbleSize}px`;
        bubble.style.height = `${bubbleSize}px`;
        bubble.style.position = 'absolute';
        bubble.style.top = `${50 + offsetY * 100 / size}%`;
        bubble.style.left = `${50 + offsetX * 100 / size}%`;
        bubble.style.transform = 'translate(-50%, -50%)';
        bubble.style.filter = 'blur(5px)';
        bubble.style.opacity = '0.95';
        
        cloudGroup.appendChild(bubble);
    }
    
    // Ajouter le corps principal
    cloudGroup.appendChild(mainCloud);
    
    // Ajouter une animation de déplacement
    const duration = Math.random() * 60 + 120;
    cloudGroup.style.setProperty('--float-duration', `${duration}s`);
    cloudGroup.style.setProperty('--float-delay', `${Math.random() * 10}s`);
    
    // Ajouter au conteneur
    container.appendChild(cloudGroup);
    
    return cloudGroup;
}

/**
 * Crée des nuages avec des formes plus complexes et plus visibles
 */
function generateProminentClouds() {
    if (!config.prominentClouds.enabled) return;
    
    const container = createWeatherContainer();
    
    for (let i = 0; i < config.prominentClouds.count; i++) {
        // Créer un nuage proéminent
        const cloud = document.createElement('div');
        cloud.className = 'prominent-cloud';
        
        // Taille et position
        const size = Math.random() * (config.prominentClouds.maxSize - config.prominentClouds.minSize) + config.prominentClouds.minSize;
        const top = Math.random() * 60; // % 
        const left = Math.random() * 100; // %
        
        // Vitesse et délai
        const duration = Math.random() * 120 + 120; // 120-240s pour mouvement lent
        const delay = Math.random() * 40; // 0-40s
        
        // Appliquer styles
        cloud.style.width = `${size}px`;
        cloud.style.height = `${size * 0.6}px`;
        cloud.style.top = `${top}%`;
        cloud.style.left = `${left}%`;
        
        // Animation personnalisée
        cloud.style.animation = `cloudFloat ${duration}s ease-in-out infinite`;
        cloud.style.animationDelay = `${delay}s`;
        
        // Ajouter une profondeur pour l'effet parallaxe
        cloud.setAttribute('data-depth', (Math.random() * 0.5 + 0.5).toString());
        
        // Ajouter au conteneur
        container.appendChild(cloud);
    }
}

/**
 * Crée des formes de nuage plus naturelles
 */
function generateCloudShapes() {
    if (!config.cloudShapes.enabled) return;
    
    const container = createWeatherContainer();
    
    // Différentes formes de nuage
    const cloudTypes = {
        cumulus: { width: [200, 350], height: [0.6, 0.8], borderRadius: ['60%', '70%'] },
        stratus: { width: [300, 450], height: [0.3, 0.4], borderRadius: ['40%', '90%'] },
        cirrus: { width: [150, 250], height: [0.2, 0.3], borderRadius: ['40%', '60%'] }
    };
    
    for (let i = 0; i < config.cloudShapes.count; i++) {
        // Choisir un type de nuage aléatoire
        const type = config.cloudShapes.types[Math.floor(Math.random() * config.cloudShapes.types.length)];
        const cloudType = cloudTypes[type];
        
        // Créer le nuage
        const cloud = document.createElement('div');
        cloud.className = 'cloud-shape';
        
        // Déterminer les dimensions selon le type
        const width = Math.random() * (cloudType.width[1] - cloudType.width[0]) + cloudType.width[0];
        const height = width * (Math.random() * (cloudType.height[1] - cloudType.height[0]) + cloudType.height[0]);
        
        // Position
        const top = Math.random() * 50; // % 
        const left = Math.random() * 100; // %
        
        // Animation
        const duration = Math.random() * 180 + 180; // 180-360s
        const delay = Math.random() * 60; // 0-60s
        
        // Appliquer styles
        cloud.style.width = `${width}px`;
        cloud.style.height = `${height}px`;
        cloud.style.top = `${top}%`;
        cloud.style.left = `${left}%`;
        cloud.style.borderRadius = cloudType.borderRadius[Math.floor(Math.random() * cloudType.borderRadius.length)];
        
        // Animation
        cloud.style.animation = `cloudFloat ${duration}s ease-in-out infinite`;
        cloud.style.animationDelay = `${delay}s`;
        
        // Profondeur pour parallaxe
        cloud.setAttribute('data-depth', (Math.random() * 0.7 + 0.3).toString());
        
        // Ajouter au conteneur
        container.appendChild(cloud);
        
        // Créer des éléments supplémentaires pour les nuages cumulus (plus volumineux)
        if (type === 'cumulus') {
            // Ajouter 2-4 bulles supplémentaires pour donner un aspect plus bouffant
            const bubbleCount = Math.floor(Math.random() * 3) + 2;
            
            for (let j = 0; j < bubbleCount; j++) {
                const bubble = document.createElement('div');
                bubble.className = 'cloud-element';
                
                const bubbleSize = width * (Math.random() * 0.4 + 0.3); // 30-70% de la taille du nuage
                const offsetX = (Math.random() * width * 0.7) - (width * 0.35);
                const offsetY = (Math.random() * height * 0.5) - (height * 0.25);
                
                bubble.style.width = `${bubbleSize}px`;
                bubble.style.height = `${bubbleSize}px`;
                bubble.style.position = 'absolute';
                bubble.style.left = `${left}%`;
                bubble.style.top = `${top}%`;
                bubble.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                bubble.style.animation = `cloudPulse ${Math.random() * 10 + 15}s ease-in-out infinite`;
                
                container.appendChild(bubble);
            }
        }
    }
}

/**
 * Initialise l'environnement nuageux
 */
function initCloudEnvironment() {
    // Créer les éléments de nuage
    generateClouds();
    createCloudGroup();
    
    // Ajouter les nouveaux types de nuages plus visibles
    generateProminentClouds();
    generateCloudShapes();
}

/**
 * Ajoute les animations CSS nécessaires si elles n'existent pas déjà
 */
function addRequiredAnimations() {
    // Vérifier si les animations existent déjà
    if (document.getElementById('cloud-animations')) return;
    
    // Créer un élément de style
    const styleElement = document.createElement('style');
    styleElement.id = 'cloud-animations';
    
    // Définir les animations
    styleElement.textContent = `
        @keyframes cloudFloat {
            0% { transform: translateX(0) translateY(0); }
            25% { transform: translateX(15vw) translateY(-10px); }
            50% { transform: translateX(30vw) translateY(10px); }
            75% { transform: translateX(15vw) translateY(20px); }
            100% { transform: translateX(0) translateY(0); }
        }
        
        @keyframes groupFloat {
            0% { transform: translateX(0) translateY(0); }
            33% { transform: translateX(10vw) translateY(-15px); }
            66% { transform: translateX(20vw) translateY(15px); }
            100% { transform: translateX(0) translateY(0); }
        }
        
        @keyframes cloudPulse {
            0% { transform: scale(0.9); opacity: 0.8; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(0.9); opacity: 0.8; }
        }
        
        @keyframes rainDrop {
            0% { transform: translateY(-20px); opacity: 0; }
            20% { opacity: 0.7; }
            80% { opacity: 0.7; }
            100% { transform: translateY(100vh); opacity: 0; }
        }
        
        @keyframes sunRay {
            0% { transform: scale(0.8); opacity: 0.1; }
            50% { transform: scale(1); opacity: 0.3; }
            100% { transform: scale(0.8); opacity: 0.1; }
        }
        
        @keyframes cloudGrow {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes cloudShadow {
            0% { box-shadow: 0 5px 15px rgba(255, 255, 255, 0.6); }
            50% { box-shadow: 0 15px 30px rgba(255, 255, 255, 0.8); }
            100% { box-shadow: 0 5px 15px rgba(255, 255, 255, 0.6); }
        }
        
        /* Définir une classe globale pour les animations d'entrée des nuages */
        .cloud-enter {
            animation: cloudGrow 2s ease-out forwards;
        }
        
        /* Renforcer les nuages avec une ombre pulsante */
        .cloud-element, .cloud-shape, .prominent-cloud {
            animation-name: cloudFloat, cloudShadow;
            animation-duration: var(--float-duration, 20s), 7s;
            animation-timing-function: ease-in-out, ease-in-out;
            animation-iteration-count: infinite, infinite;
            animation-delay: var(--float-delay, 0s), 0s;
        }
    `;
    
    // Ajouter l'élément de style au head
    document.head.appendChild(styleElement);
}

/**
 * Fonction utilitaire pour afficher des messages
 * Évite la récursion infinie en n'appelant pas window.showToast
 */
function displayCloudToast(title, message, type = 'info') {
    // Si la fonction showToast existe dans window et n'est pas cette fonction
    if (typeof window.showToast === 'function') {
        window.showToast(title, message, type);
    } 
    // Sinon, créer une version minimale
    else {
        console.log(`${title}: ${message} (${type})`);
    }
}