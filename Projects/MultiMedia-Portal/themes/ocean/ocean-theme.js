/**
 * Thème Océan avec vagues multiples et plage dynamique
 * Ajoute des effets océaniques riches sans perturber la structure
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Thème Océan avec vagues multiples et plage dynamique initialisé');
    
    // Créer le conteneur océanique
    createOceanElements();
    
    // Ajouter les bulles
    createBubbles();
    
    // Effets de survol
    addHoverEffects();
    
    // Adaptation jour/nuit
    setupDayNightMode();
});

/**
 * Fonction pour gérer le redimensionnement de la fenêtre
 */
window.addEventListener('resize', function() {
    // Récréer les éléments océaniques pour s'adapter à la nouvelle taille
    const oceanContainer = document.querySelector('.ocean-container');
    if (oceanContainer) {
        document.body.removeChild(oceanContainer);
        createOceanElements();
    }
});

/**
 * Crée tous les éléments océaniques en bas de la page
 */
function createOceanElements() {
    // Vérifier si le conteneur existe déjà
    if (!document.querySelector('.ocean-container')) {
        // Conteneur principal
        const oceanContainer = document.createElement('div');
        oceanContainer.className = 'ocean-container';
        
        // Vagues multiples
        for (let i = 1; i <= 3; i++) {
            const wave = document.createElement('div');
            wave.className = `wave-${i}`;
            oceanContainer.appendChild(wave);
        }
        
        // Vagues d'avant-plan
        const waveFront = document.createElement('div');
        waveFront.className = 'wave-front';
        oceanContainer.appendChild(waveFront);
        
        // Plage
        const beach = document.createElement('div');
        beach.className = 'beach';
        
        // Conteneur de mousse
        const foamContainer = document.createElement('div');
        foamContainer.className = 'foam-container';
        
        // Trois bandes de mousse avec délais différents
        for (let i = 1; i <= 3; i++) {
            const foam = document.createElement('div');
            foam.className = `foam foam-${i}`;
            foamContainer.appendChild(foam);
        }
        
        // Élément de marée
        const tide = document.createElement('div');
        tide.className = 'tide';
        beach.appendChild(tide);
        
        // Ajouter des décorations de plage (coquillages, étoiles de mer)
        addBeachDecorations(beach);
        
        // Assembler les éléments
        oceanContainer.appendChild(foamContainer);
        oceanContainer.appendChild(beach);
        document.body.appendChild(oceanContainer);
    }
}

/**
 * Ajoute des éléments décoratifs sur la plage
 */
function addBeachDecorations(beach) {
    // Coquillages et étoiles de mer
    const decorations = [
        { class: 'beach-decoration shell-1', left: '5%' },
        { class: 'beach-decoration shell-2', left: '25%' },
        { class: 'beach-decoration shell-3', left: '62%' },
        { class: 'beach-decoration star', left: '80%' }
    ];
    
    decorations.forEach(dec => {
        const decoration = document.createElement('div');
        decoration.className = dec.class;
        decoration.style.left = dec.left;
        beach.appendChild(decoration);
    });
}

/**
 * Crée et anime des bulles d'eau qui montent
 */
function createBubbles() {
    // Créer des bulles initiales
    for (let i = 0; i < 20; i++) {
        createBubble();
    }
    
    // Continuer à créer des bulles périodiquement
    setInterval(() => {
        if (document.querySelectorAll('.bubble').length < 25) {
            createBubble();
        }
    }, 1500);
}

/**
 * Crée une bulle individuelle avec des propriétés aléatoires
 */
function createBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // Taille aléatoire
    const size = Math.random() * 30 + 10;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    
    // Position horizontale aléatoire
    const posX = Math.random() * window.innerWidth;
    bubble.style.left = `${posX}px`;
    bubble.style.bottom = '-50px';
    
    // Durée aléatoire pour l'animation
    const duration = Math.random() * 10 + 12;
    bubble.style.setProperty('--bubble-duration', `${duration}s`);
    
    // Ajouter au body
    document.body.appendChild(bubble);
    
    // Démarrer l'animation avec un délai
    setTimeout(() => {
        bubble.style.opacity = '0.7';
    }, 100);
    
    // Supprimer la bulle après l'animation
    setTimeout(() => {
        if (bubble && document.body.contains(bubble)) {
            document.body.removeChild(bubble);
        }
    }, duration * 1000);
}

/**
 * Ajoute des effets au survol des éléments
 */
function addHoverEffects() {
    // Effet sur les cartes au survol
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 12px 25px rgba(26, 118, 198, 0.4)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // Effet sur les boutons
    const buttons = document.querySelectorAll('.card-link, .navbar-config-btn, .view-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Effet sur la navbar-brand
    const brand = document.querySelector('.navbar-brand');
    if (brand) {
        brand.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 15px rgba(26, 118, 198, 0.5)';
        });
        
        brand.addEventListener('mouseleave', function() {
            this.style.textShadow = '';
        });
    }
}

/**
 * Configure l'adaptation jour/nuit avec effets océaniques
 */
function setupDayNightMode() {
    // Vérifier l'heure actuelle
    const checkTime = () => {
        const currentHour = new Date().getHours();
        const isNight = currentHour < 6 || currentHour >= 19; // Nuit entre 19h et 6h
        
        if (isNight) {
            // Mode nuit - océan sombre
            document.body.style.background = 'linear-gradient(-45deg, #01579b, #0277bd, #0288d1, #039be5)';
            document.body.style.backgroundSize = '400% 400%';
            
            // Adapter les vagues en mode nuit
            document.querySelectorAll('.wave-1, .wave-2, .wave-3').forEach((wave, index) => {
                // Assombrir les vagues
                wave.style.filter = 'brightness(0.7) saturate(1.2)';
                // Ralentir légèrement les vagues la nuit
                wave.style.animationDuration = `${20 + (index * 5)}s`;
            });
            
            // Adapter la mousse en mode nuit
            document.querySelectorAll('.foam').forEach(foam => {
                foam.style.opacity = '0.6';
                foam.style.filter = 'brightness(0.8)';
            });
            
            // Adapter la plage en mode nuit
            const beach = document.querySelector('.beach');
            if (beach) {
                beach.style.filter = 'brightness(0.7) saturate(0.8)';
            }
            
            // Adapter les cartes en mode nuit
            document.querySelectorAll('.service-card').forEach(card => {
                card.style.backgroundColor = 'rgba(26, 58, 90, 0.9)';
                
                const cardTitle = card.querySelector('.card-title');
                if (cardTitle) cardTitle.style.color = '#4fd4e9';
                
                const cardDescription = card.querySelector('.card-description');
                if (cardDescription) cardDescription.style.color = '#e0f7fa';
            });
            
            // Adapter le footer en mode nuit
            const footer = document.querySelector('footer');
            if (footer) {
                footer.style.backgroundColor = 'rgba(26, 58, 90, 0.9)';
                footer.style.color = '#e0f7fa';
            }
            
            // Adapter les bulles
            document.querySelectorAll('.bubble').forEach(bubble => {
                bubble.style.backgroundColor = 'rgba(79, 212, 233, 0.2)';
                bubble.style.boxShadow = 'inset 0 0 8px rgba(79, 212, 233, 0.5)';
            });
        } else {
            // Mode jour - océan clair
            document.body.style.background = 'linear-gradient(-45deg, #b2ebf2, #80deea, #4dd0e1, #26c6da)';
            document.body.style.backgroundSize = '400% 400%';
            
            // Réinitialiser les vagues
            document.querySelectorAll('.wave-1, .wave-2, .wave-3').forEach((wave, index) => {
                wave.style.filter = '';
                wave.style.animationDuration = `${15 + (index * 5)}s`;
            });
            
            // Réinitialiser la mousse
            document.querySelectorAll('.foam').forEach(foam => {
                foam.style.opacity = '';
                foam.style.filter = '';
            });
            
            // Réinitialiser la plage
            const beach = document.querySelector('.beach');
            if (beach) {
                beach.style.filter = '';
            }
            
            // Réinitialiser les cartes
            document.querySelectorAll('.service-card').forEach(card => {
                card.style.backgroundColor = 'rgba(240, 248, 255, 0.9)';
                
                const cardTitle = card.querySelector('.card-title');
                if (cardTitle) cardTitle.style.color = '';
                
                const cardDescription = card.querySelector('.card-description');
                if (cardDescription) cardDescription.style.color = '';
            });
            
            // Réinitialiser le footer
            const footer = document.querySelector('footer');
            if (footer) {
                footer.style.backgroundColor = 'rgba(240, 248, 255, 0.85)';
                footer.style.color = '';
            }
            
            // Réinitialiser les bulles
            document.querySelectorAll('.bubble').forEach(bubble => {
                bubble.style.backgroundColor = '';
                bubble.style.boxShadow = '';
            });
        }
    };
    
    // Vérifier au chargement
    checkTime();
    
    // Vérifier toutes les heures
    setInterval(checkTime, 60 * 60 * 1000);
}