/**
 * Thème Jungle - Script d'animation et d'effets dynamiques
 * Ce script ajoute des éléments visuels interactifs au thème jungle
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log("Thème Jungle chargé");
    
    // Création de l'environnement jungle
    initJungleEnvironment();
    addJungleStyles();
});

/**
 * Initialise l'environnement jungle avec des éléments décoratifs
 */

function initJungleEnvironment() {
    const body = document.body;
    
    // Ajouter des feuilles qui tombent aléatoirement
    createFallingLeaves();
    
    // Ajouter des papillons/oiseaux qui volent occasionnellement
    createFlyingAnimals();
    
    // Effet de lumière tamisée qui change subtilement
    createAmbientLightEffect();
    
    // Ajouter des lianes décoratives aux coins de l'écran
    addDecorativeVines();
    
    // Ajouter un cadre de feuillage dense autour de l'écran
    createJungleFrame();
    
    // Ajouter des buissons denses sur les bords
    addDenseBushes();
    
    // Ajouter des lianes décoratives beaucoup plus présentes
    addDecorativeVines();
    
    // Ajouter des feuilles qui tombent aléatoirement
    createFallingLeaves();
    
    // Ajouter des papillons/oiseaux qui volent occasionnellement
    createFlyingAnimals();
    
    // Effet de lumière tamisée qui change subtilement
    createAmbientLightEffect();
}

/**
 * Crée des feuilles qui tombent aléatoirement sur l'écran
 */
function createFallingLeaves() {
    const leafTypes = [
        "M10,0 C15,0 20,5 20,10 C20,15 15,20 10,20 C5,20 0,15 0,10 C0,5 5,0 10,0 Z",  // Cercle simple
        "M10,0 C15,0 20,5 20,15 C15,20 5,20 0,15 C0,5 5,0 10,0 Z",  // Forme de feuille simple
        "M0,10 C0,5 5,0 10,0 C15,0 20,5 20,10 C20,15 15,20 10,20 C5,20 0,15 0,10 Z M10,5 L15,10 L10,15 L5,10 Z"  // Feuille avec nervure
    ];
    
    // Container pour les feuilles
    const leafContainer = document.createElement('div');
    leafContainer.className = 'jungle-environment-container';
    leafContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
    `;
    document.body.appendChild(leafContainer);
    
    // Créer des feuilles périodiquement
    function createLeaf() {
        if (document.hidden) return; // Ne pas créer de feuilles si la page n'est pas visible
        
        // Seulement créer des feuilles si l'utilisateur est actif
        if (window.lastActivity && (Date.now() - window.lastActivity > 60000)) return;
        
        const leaf = document.createElement('div');
        leaf.className = 'jungle-leaf';
        
        // Taille et rotation aléatoires
        const size = Math.random() * 20 + 15;
        const rotation = Math.random() * 360;
        const leafTypeIndex = Math.floor(Math.random() * leafTypes.length);
        
        // Couleur aléatoire (nuances de vert)
        const hue = 80 + Math.random() * 40; // Verts : 80-120
        const saturation = 40 + Math.random() * 60; // 40%-100%
        const lightness = 20 + Math.random() * 30; // 20%-50%
        const opacity = 0.4 + Math.random() * 0.6; // 40%-100%
        
        // Créer le SVG de la feuille
        leaf.innerHTML = `
            <svg width="${size}" height="${size}" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="${leafTypes[leafTypeIndex]}" 
                      fill="hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})" 
                      transform="rotate(${rotation}, 10, 10)"/>
            </svg>
        `;
        
        // Position de départ (en haut de l'écran, position X aléatoire)
        const startX = Math.random() * window.innerWidth;
        leaf.style.cssText = `
            position: absolute;
            top: -50px;
            left: ${startX}px;
            transform-origin: center;
            animation: leaf-sway 5s ease-in-out infinite;
            filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1));
        `;
        
        leafContainer.appendChild(leaf);
        
        // Animation de chute
        const fallDuration = 15000 + Math.random() * 10000; // 15-25 secondes
        const swayAmount = 100 + Math.random() * 150; // Amplitude de balancement
        
        // Utiliser les keyframes pour animer la chute
        const startTime = Date.now();
        const endTime = startTime + fallDuration;
        
        function animateLeaf() {
            const now = Date.now();
            if (now >= endTime) {
                leaf.remove();
                return;
            }
            
            const progress = (now - startTime) / fallDuration;
            const posY = (window.innerHeight + 50) * progress - 50;
            const swayX = Math.sin(progress * Math.PI * 4) * swayAmount;
            
            leaf.style.transform = `translate(${swayX}px, ${posY}px) rotate(${rotation + progress * 360}deg)`;
            
            requestAnimationFrame(animateLeaf);
        }
        
        requestAnimationFrame(animateLeaf);
    }
    
    // Créer une feuille toutes les 3-8 secondes
    function scheduleNextLeaf() {
        const delay = 3000 + Math.random() * 5000;
        setTimeout(() => {
            createLeaf();
            scheduleNextLeaf();
        }, delay);
    }
    
    // Démarrer la création de feuilles
    scheduleNextLeaf();
    
    // Suivre l'activité de l'utilisateur
    window.lastActivity = Date.now();
    document.addEventListener('mousemove', () => {
        window.lastActivity = Date.now();
    });
}

/**
 * Crée des animaux volants (papillons/oiseaux) qui apparaissent occasionnellement
 */
function createFlyingAnimals() {
    // Container pour les animaux
    const animalContainer = document.createElement('div');
    animalContainer.className = 'jungle-animal-container';
    animalContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2;
        overflow: hidden;
    `;
    document.body.appendChild(animalContainer);
    
    // Les différents animaux (papillons, petits oiseaux)
    const animalTypes = [
        // Papillon simple
        `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12,2L8,6L12,10L16,6L12,2Z M12,10L8,14L12,18L16,14L12,10Z" fill="#FFA000">
                <animateTransform attributeName="transform" type="rotate" from="0 12 10" to="20 12 10" dur="0.8s" repeatCount="indefinite" additive="sum" />
            </path>
        </svg>`,
        
        // Oiseau stylisé
        `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22,10C22,5.58 18.42,2 14,2C8.58,2 4,6.58 4,12C4,17.42 8.58,22 14,22C19.42,22 22,16 22,10Z" fill="#795548">
                <animateTransform attributeName="transform" type="scale" from="1 1" to="1.1 0.9" dur="0.4s" repeatCount="indefinite" additive="sum" />
            </path>
        </svg>`,
        
        // Toucan stylisé
        `<svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5,10 C5,7 7,5 10,5 C13,5 20,7 25,5 C25,10 20,15 10,15 C7,15 5,13 5,10Z" fill="#333">
                <animateTransform attributeName="transform" type="rotate" from="-5 10 10" to="5 10 10" dur="1s" repeatCount="indefinite" additive="sum" />
            </path>
            <path d="M25,5 C27,4 28,6 25,7 Z" fill="#FF9800"></path>
        </svg>`
    ];
    
    // Fonction pour créer un nouvel animal
    function createAnimal() {
        if (document.hidden) return; // Ne pas créer d'animaux si la page n'est pas visible
        
        // Seulement créer des animaux si l'utilisateur est actif
        if (window.lastActivity && (Date.now() - window.lastActivity > 120000)) return;
        
        const animal = document.createElement('div');
        animal.className = 'jungle-animal';
        
        // Choisir un animal aléatoire
        const animalTypeIndex = Math.floor(Math.random() * animalTypes.length);
        animal.innerHTML = animalTypes[animalTypeIndex];
        
        // Taille aléatoire
        const scale = 0.8 + Math.random() * 1.2;
        animal.style.transform = `scale(${scale})`;
        
        // Position de départ (côté gauche ou droit)
        const startFromLeft = Math.random() > 0.5;
        const startX = startFromLeft ? -50 : window.innerWidth + 50;
        const startY = Math.random() * (window.innerHeight * 0.6) + 50;
        
        animal.style.cssText = `
            position: absolute;
            top: ${startY}px;
            left: ${startX}px;
            filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2));
            transform: scale(${scale}) ${startFromLeft ? '' : 'scaleX(-1)'};
        `;
        
        animalContainer.appendChild(animal);
        
        // Animation du vol
        const flyDuration = 8000 + Math.random() * 7000; // 8-15 secondes
        const endX = startFromLeft ? window.innerWidth + 100 : -100;
        const controlY = startY + (Math.random() * 200 - 100); // Point de contrôle pour courbe
        
        const startTime = Date.now();
        const endTime = startTime + flyDuration;
        
        function animateAnimal() {
            const now = Date.now();
            if (now >= endTime) {
                animal.remove();
                return;
            }
            
            const progress = (now - startTime) / flyDuration;
            
            // Mouvement en courbe de Bézier simple (quadratique)
            const inverseProgress = 1 - progress;
            const posX = startX * inverseProgress * inverseProgress + 
                         2 * controlY * inverseProgress * progress + 
                         endX * progress * progress;
                         
            const posY = startY * inverseProgress * inverseProgress + 
                         2 * controlY * inverseProgress * progress + 
                         startY * progress * progress;
            
            animal.style.left = `${posX}px`;
            animal.style.top = `${posY}px`;
            
            requestAnimationFrame(animateAnimal);
        }
        
        requestAnimationFrame(animateAnimal);
    }
    
    // Créer un animal tous les 20-40 secondes
    function scheduleNextAnimal() {
        const delay = 20000 + Math.random() * 20000;
        setTimeout(() => {
            createAnimal();
            scheduleNextAnimal();
        }, delay);
    }
    
    // Démarrer la création d'animaux
    scheduleNextAnimal();
}

/**
 * Crée un effet de lumière ambiante qui change subtilement
 */
function createAmbientLightEffect() {
    const ambientLight = document.createElement('div');
    ambientLight.className = 'jungle-ambient-light';
    ambientLight.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        background: radial-gradient(circle at 50% 50%, rgba(255, 249, 214, 0), rgba(255, 249, 214, 0.03));
        opacity: 0;
        transition: all 20s ease;
    `;
    document.body.appendChild(ambientLight);
    
    // Animation subtile de la lumière
    function animateLight() {
        // Position aléatoire du point lumineux
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const size = 30 + Math.random() * 40;
        const opacity = 0.02 + Math.random() * 0.04;
        
        ambientLight.style.background = `radial-gradient(circle at ${posX}% ${posY}%, rgba(255, 249, 214, ${opacity}), rgba(255, 249, 214, 0) ${size}%)`;
        ambientLight.style.opacity = "1";
        
        setTimeout(() => {
            animateLight();
        }, 20000);
    }
    
    // Démarrer l'animation de lumière
    animateLight();
}

/**
 * Ajoute des lianes décoratives aux coins de l'écran
 */
function addDecorativeVines() {
    // Coins où ajouter des lianes
    const corners = [
        { top: 0, left: 0, rotate: 0 },
        { top: 0, right: 0, rotate: 90 },
        { bottom: 0, left: 0, rotate: 270 },
        { bottom: 0, right: 0, rotate: 180 }
    ];
    
    corners.forEach((corner, index) => {
        // Seulement ajouter des lianes à certains coins (aléatoire)
        if (Math.random() > 0.7) return;
        
        const vine = document.createElement('div');
        vine.className = 'jungle-vine';
        
        const positionStyle = Object.entries(corner)
            .filter(([key]) => key !== 'rotate')
            .map(([key, value]) => `${key}: ${value}px;`)
            .join(' ');
        
        vine.style.cssText = `
            position: fixed;
            ${positionStyle}
            width: 100px;
            height: 100px;
            pointer-events: none;
            z-index: 10;
            opacity: 0.3;
            transform: rotate(${corner.rotate}deg);
        `;
        
        // SVG de liane
        vine.innerHTML = `
            <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,0 Q30,10 40,30 T50,70 Q60,90 100,100" stroke="#2d7e36" stroke-width="3" fill="none"/>
                <path d="M20,0 Q40,20 30,40 T60,80 Q80,90 100,80" stroke="#2d7e36" stroke-width="2" fill="none"/>
                <path d="M10,30 Q20,40 15,60 T30,80 Q40,90 50,100" stroke="#2d7e36" stroke-width="2" fill="none"/>
            </svg>
        `;
        
        document.body.appendChild(vine);
    });
}

/**
 * Crée un cadre de feuillage dense autour de l'écran
 */
function createJungleFrame() {
    // Container pour le cadre
    const frameContainer = document.createElement('div');
    frameContainer.className = 'jungle-frame-container';
    frameContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;
    document.body.appendChild(frameContainer);
    
    // Différents types de feuilles pour le cadre
    const leafTypes = [
        // Feuille de palmier
        `<svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
            <path d="M10,40 Q40,0 100,5 Q60,40 100,75 Q40,80 10,40" fill="#2d8e44" stroke="#1a6d31" stroke-width="1" />
            <path d="M10,40 Q40,30 100,5" fill="none" stroke="#1a6d31" stroke-width="1.5" />
            <path d="M10,40 Q40,50 100,75" fill="none" stroke="#1a6d31" stroke-width="1.5" />
        </svg>`,
        
        // Grande feuille tropicale
        `<svg width="150" height="100" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="leaf-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#43b463" />
                    <stop offset="100%" stop-color="#2d8e44" />
                </linearGradient>
            </defs>
            <path d="M10,50 Q50,0 140,10 Q100,50 140,90 Q50,100 10,50 Z" fill="url(#leaf-gradient-1)" />
            <path d="M10,50 Q50,0 140,10" fill="none" stroke="#1a6d31" stroke-width="1" />
            <path d="M10,50 Q50,100 140,90" fill="none" stroke="#1a6d31" stroke-width="1" />
            <path d="M30,50 L120,50 M50,30 L100,30 M50,70 L100,70" fill="none" stroke="#1a6d31" stroke-width="0.5" opacity="0.7" />
        </svg>`,
        
        // Feuille de bananier
        `<svg width="140" height="90" viewBox="0 0 140 90" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="leaf-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#3da55c" />
                    <stop offset="100%" stop-color="#2d8e44" />
                </linearGradient>
            </defs>
            <path d="M5,45 Q40,0 135,5 Q120,45 135,85 Q40,90 5,45 Z" fill="url(#leaf-gradient-2)" stroke="#1a6d31" stroke-width="1" />
            <path d="M5,45 Q40,45 135,45" fill="none" stroke="#1a6d31" stroke-width="2" />
            <path d="M30,15 L120,15 M30,75 L120,75" fill="none" stroke="#1a6d31" stroke-width="0.7" opacity="0.7" />
        </svg>`,
        
        // Petite feuille
        `<svg width="80" height="60" viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
            <path d="M5,30 Q30,5 75,10 Q60,30 75,50 Q30,55 5,30 Z" fill="#3da55c" stroke="#2d8e44" stroke-width="1" />
            <path d="M5,30 Q30,30 75,30" fill="none" stroke="#2d8e44" stroke-width="1" />
        </svg>`,
        
        // Fougère
        `<svg width="120" height="70" viewBox="0 0 120 70" xmlns="http://www.w3.org/2000/svg">
            <path d="M10,35 L110,35" stroke="#2d8e44" stroke-width="2" />
            <path d="M30,35 L40,20 M40,35 L55,15 M50,35 L70,25 M60,35 L75,20 M70,35 L85,25 M80,35 L95,20" stroke="#2d8e44" stroke-width="1.5" />
            <path d="M30,35 L40,50 M40,35 L55,55 M50,35 L70,45 M60,35 L75,50 M70,35 L85,45 M80,35 L95,50" stroke="#2d8e44" stroke-width="1.5" />
        </svg>`
    ];
    
    // Créer le cadre supérieur
    createFrameSide('top', frameContainer, leafTypes);
    
    // Créer le cadre inférieur
    createFrameSide('bottom', frameContainer, leafTypes);
    
    // Créer le cadre gauche
    createFrameSide('left', frameContainer, leafTypes);
    
    // Créer le cadre droit
    createFrameSide('right', frameContainer, leafTypes);
    
    // Ajouter des touffes plus denses dans les coins
    createCornerBushes(frameContainer, leafTypes);
}

/**
 * Crée un côté du cadre de feuillage
 */
function createFrameSide(side, container, leafTypes) {
    const isVertical = (side === 'left' || side === 'right');
    const length = isVertical ? window.innerHeight : window.innerWidth;
    
    // Nombre de feuilles basé sur la taille de l'écran
    const leafCount = Math.max(5, Math.floor(length / 150));
    
    for (let i = 0; i < leafCount; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'jungle-frame-leaf';
        
        // Position sur le côté
        let posX, posY, rotation, zIndex;
        
        if (side === 'top') {
            posX = (length / leafCount) * i + Math.random() * 100 - 50;
            posY = -20 - Math.random() * 30;
            rotation = Math.random() * 30 - 60; // Rotation vers le bas
            zIndex = 1;
        } else if (side === 'bottom') {
            posX = (length / leafCount) * i + Math.random() * 100 - 50;
            posY = window.innerHeight - Math.random() * 30;
            rotation = Math.random() * 30 + 30; // Rotation vers le haut
            zIndex = 1;
        } else if (side === 'left') {
            posX = -20 - Math.random() * 40;
            posY = (length / leafCount) * i + Math.random() * 100 - 50;
            rotation = Math.random() * 30 - 15; // Rotation vers la droite
            zIndex = 1;
        } else { // right
            posX = window.innerWidth - Math.random() * 40;
            posY = (length / leafCount) * i + Math.random() * 100 - 50;
            rotation = Math.random() * 30 + 165; // Rotation vers la gauche
            zIndex = 1;
        }
        
        // Type de feuille aléatoire
        const leafType = leafTypes[Math.floor(Math.random() * leafTypes.length)];
        leaf.innerHTML = leafType;
        
        // Taille aléatoire
        const scale = 0.6 + Math.random() * 0.7;
        
        // Style de la feuille
        leaf.style.cssText = `
            position: fixed;
            top: ${posY}px;
            left: ${posX}px;
            transform: rotate(${rotation}deg) scale(${scale});
            opacity: ${0.7 + Math.random() * 0.3};
            z-index: ${zIndex};
            filter: drop-shadow(0 3px 5px rgba(0,0,0,0.2));
        `;
        
        // Animation subtile
        leaf.style.animation = `leaf-sway ${3 + Math.random() * 2}s ease-in-out infinite alternate`;
        
        container.appendChild(leaf);
    }
}

/**
 * Crée des touffes de végétation denses dans les coins
 */
function createCornerBushes(container, leafTypes) {
    const corners = [
        { x: 0, y: 0 }, // Coin supérieur gauche
        { x: window.innerWidth, y: 0 }, // Coin supérieur droit
        { x: 0, y: window.innerHeight }, // Coin inférieur gauche
        { x: window.innerWidth, y: window.innerHeight } // Coin inférieur droit
    ];
    
    corners.forEach((corner, cornerIndex) => {
        // Nombre de feuilles pour ce coin (10-15)
        const leafCount = 10 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < leafCount; i++) {
            const leaf = document.createElement('div');
            leaf.className = 'jungle-corner-bush';
            
            // Distance du coin (plus proche du coin)
            const distance = 20 + Math.random() * 100;
            const angle = Math.random() * Math.PI / 2 + (cornerIndex * Math.PI / 2);
            
            // Position relative au coin
            let posX = corner.x + Math.cos(angle) * distance * (corner.x === 0 ? 1 : -1);
            let posY = corner.y + Math.sin(angle) * distance * (corner.y === 0 ? 1 : -1);
            
            // Type de feuille aléatoire ou buisson spécial
            let leafHTML;
            if (Math.random() > 0.7) {
                leafHTML = leafTypes[Math.floor(Math.random() * leafTypes.length)];
            } else {
                // Buisson dense spécial pour les coins
                leafHTML = createBushSVG();
            }
            
            leaf.innerHTML = leafHTML;
            
            // Taille et rotation aléatoires
            const scale = 0.8 + Math.random() * 0.8;
            const rotation = Math.random() * 360;
            
            // Style du buisson
            leaf.style.cssText = `
                position: fixed;
                top: ${posY}px;
                left: ${posX}px;
                transform: rotate(${rotation}deg) scale(${scale});
                opacity: ${0.8 + Math.random() * 0.2};
                z-index: 1;
                filter: drop-shadow(0 5px 10px rgba(0,0,0,0.3));
            `;
            
            // Animation subtile
            leaf.style.animation = `leaf-sway ${2 + Math.random() * 3}s ease-in-out infinite alternate`;
            
            container.appendChild(leaf);
        }
    });
}

/**
 * Crée un SVG de buisson dense
 */
function createBushSVG() {
    // Couleurs de feuillage variées
    const colors = [
        '#2d8e44', '#3da55c', '#1a6d31', '#2d9a48', '#338a3e'
    ];
    
    // Créer plusieurs couches de feuilles pour donner un effet dense
    let paths = '';
    
    // Couche de base (forme générale du buisson)
    paths += `<ellipse cx="60" cy="50" rx="55" ry="45" fill="${colors[0]}" />`;
    
    // Ajouter des formes organiques pour les détails du buisson
    for (let i = 0; i < 15; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const cx = 20 + Math.random() * 80;
        const cy = 20 + Math.random() * 60;
        const rx = 10 + Math.random() * 25;
        const ry = 10 + Math.random() * 20;
        
        paths += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${color}" />`;
    }
    
    // Ajouter quelques points pour la texture
    for (let i = 0; i < 20; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const cx = 10 + Math.random() * 100;
        const cy = 10 + Math.random() * 80;
        const r = 2 + Math.random() * 4;
        
        paths += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" />`;
    }
    
    return `<svg width="120" height="100" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
        ${paths}
    </svg>`;
}

/**
 * Ajoute des buissons denses sur les bords de l'écran
 */
function addDenseBushes() {
    // Container pour les buissons
    const bushContainer = document.createElement('div');
    bushContainer.className = 'jungle-bush-container';
    bushContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
    `;
    document.body.appendChild(bushContainer);
    
    // Types de buissons
    const bushTypes = [
        // Buisson dense tropical
        `<svg width="200" height="150" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="bush-gradient-1" cx="50%" cy="80%" r="80%">
                    <stop offset="0%" stop-color="#43b463" />
                    <stop offset="70%" stop-color="#2d8e44" />
                    <stop offset="100%" stop-color="#1a6d31" />
                </radialGradient>
            </defs>
            
            <!-- Forme de base du buisson -->
            <path d="M20,145 
                     C20,100 0,80 30,60 
                     C60,40 100,30 140,50 
                     C180,70 190,100 180,145 
                     Z" 
                  fill="url(#bush-gradient-1)" />
            
            <!-- Détails des feuilles -->
            <g opacity="0.8">
                <path d="M40,60 Q30,40 50,30" stroke="#1a6d31" stroke-width="2" fill="none" />
                <path d="M60,50 Q50,20 80,10" stroke="#1a6d31" stroke-width="2" fill="none" />
                <path d="M100,40 Q110,10 140,20" stroke="#1a6d31" stroke-width="2" fill="none" />
                <path d="M140,60 Q160,40 170,60" stroke="#1a6d31" stroke-width="2" fill="none" />
            </g>
            
            <!-- Points pour texture -->
            <g fill="#43b463">
                <circle cx="50" cy="70" r="8" />
                <circle cx="80" cy="50" r="7" />
                <circle cx="120" cy="60" r="9" />
                <circle cx="150" cy="80" r="6" />
                <circle cx="60" cy="90" r="10" />
                <circle cx="100" cy="80" r="8" />
                <circle cx="130" cy="100" r="7" />
                <circle cx="160" cy="110" r="9" />
            </g>
        </svg>`,
        
        // Buisson avec feuilles en éventail
        `<svg width="180" height="140" viewBox="0 0 180 140" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="bush-gradient-2" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stop-color="#43b463" />
                    <stop offset="100%" stop-color="#1a6d31" />
                </linearGradient>
            </defs>
            
            <!-- Forme de base -->
            <ellipse cx="90" cy="110" rx="80" ry="30" fill="#1a6d31" />
            
            <!-- Feuilles en éventail -->
            <g>
                <path d="M30,110 Q40,60 60,40" stroke="#2d8e44" stroke-width="3" fill="none" />
                <path d="M50,110 Q60,50 90,20" stroke="#2d8e44" stroke-width="3" fill="none" />
                <path d="M70,110 Q80,60 100,30" stroke="#2d8e44" stroke-width="3" fill="none" />
                <path d="M90,110 Q100,50 110,20" stroke="#2d8e44" stroke-width="3" fill="none" />
                <path d="M110,110 Q120,60 130,30" stroke="#2d8e44" stroke-width="3" fill="none" />
                <path d="M130,110 Q140,50 150,40" stroke="#2d8e44" stroke-width="3" fill="none" />
                
                <!-- Feuilles sur tiges -->
                <path d="M60,40 Q50,30 40,35 Q50,40 60,40" fill="#3da55c" />
                <path d="M60,40 Q70,30 80,35 Q70,40 60,40" fill="#3da55c" />
                
                <path d="M90,20 Q80,10 70,15 Q80,20 90,20" fill="#3da55c" />
                <path d="M90,20 Q100,10 110,15 Q100,20 90,20" fill="#3da55c" />
                
                <path d="M100,30 Q90,20 80,25 Q90,30 100,30" fill="#3da55c" />
                <path d="M100,30 Q110,20 120,25 Q110,30 100,30" fill="#3da55c" />
                
                <path d="M110,20 Q100,10 90,15 Q100,20 110,20" fill="#3da55c" />
                <path d="M110,20 Q120,10 130,15 Q120,20 110,20" fill="#3da55c" />
                
                <path d="M130,30 Q120,20 110,25 Q120,30 130,30" fill="#3da55c" />
                <path d="M130,30 Q140,20 150,25 Q140,30 130,30" fill="#3da55c" />
                
                <path d="M150,40 Q140,30 130,35 Q140,40 150,40" fill="#3da55c" />
                <path d="M150,40 Q160,30 170,35 Q160,40 150,40" fill="#3da55c" />
            </g>
            
            <!-- Points pour texture -->
            <g fill="#43b463" opacity="0.7">
                <circle cx="45" cy="70" r="4" />
                <circle cx="65" cy="60" r="3" />
                <circle cx="85" cy="50" r="5" />
                <circle cx="105" cy="55" r="4" />
                <circle cx="125" cy="65" r="3" />
                <circle cx="145" cy="70" r="4" />
            </g>
        </svg>`,
        
        // Buisson dense et touffu
        `<svg width="220" height="130" viewBox="0 0 220 130" xmlns="http://www.w3.org/2000/svg">
            <!-- Base du buisson -->
            <path d="M10,130 
                     C20,100 30,80 50,70
                     C70,60 90,50 120,55
                     C150,60 180,80 200,70
                     C220,60 210,100 210,130
                     Z" fill="#1a6d31" />
                     
            <!-- Feuilles principales -->
            <g>
                <ellipse cx="40" cy="80" rx="30" ry="20" fill="#2d8e44" />
                <ellipse cx="80" cy="60" rx="35" ry="25" fill="#3da55c" />
                <ellipse cx="130" cy="65" rx="40" ry="30" fill="#2d8e44" />
                <ellipse cx="180" cy="75" rx="30" ry="20" fill="#3da55c" />
                <ellipse cx="60" cy="90" rx="25" ry="15" fill="#3da55c" />
                <ellipse cx="110" cy="85" rx="30" ry="20" fill="#2d8e44" />
                <ellipse cx="160" cy="95" rx="25" ry="15" fill="#3da55c" />
            </g>
            
            <!-- Détails et texture -->
            <g stroke="#1a6d31" stroke-width="1" fill="none">
                <path d="M30,80 Q20,60 40,50" />
                <path d="M50,70 Q60,50 70,60" />
                <path d="M80,60 Q90,40 110,50" />
                <path d="M120,65 Q130,45 150,55" />
                <path d="M160,70 Q170,50 180,65" />
                <path d="M190,80 Q200,60 190,50" />
            </g>
            
            <!-- Points pour une texture additionnelle -->
            <g fill="#43b463">
                <circle cx="35" cy="75" r="5" />
                <circle cx="75" cy="55" r="6" />
                <circle cx="125" cy="60" r="7" />
                <circle cx="175" cy="70" r="5" />
                <circle cx="55" cy="85" r="4" />
                <circle cx="105" cy="80" r="6" />
                <circle cx="155" cy="90" r="4" />
            </g>
        </svg>`
    ];
    
    // Nombre de buissons sur chaque bord
    const edgeCount = {
        top: Math.max(3, Math.floor(window.innerWidth / 300)),
        bottom: Math.max(4, Math.floor(window.innerWidth / 250)),
        left: Math.max(2, Math.floor(window.innerHeight / 300)),
        right: Math.max(2, Math.floor(window.innerHeight / 300))
    };
    
    // Créer des buissons sur le bord supérieur
    for (let i = 0; i < edgeCount.top; i++) {
        createEdgeBush('top', bushContainer, bushTypes);
    }
    
    // Créer des buissons sur le bord inférieur (plus nombreux)
    for (let i = 0; i < edgeCount.bottom; i++) {
        createEdgeBush('bottom', bushContainer, bushTypes);
    }
    
    // Créer des buissons sur le bord gauche
    for (let i = 0; i < edgeCount.left; i++) {
        createEdgeBush('left', bushContainer, bushTypes);
    }
    
    // Créer des buissons sur le bord droit
    for (let i = 0; i < edgeCount.right; i++) {
        createEdgeBush('right', bushContainer, bushTypes);
    }
}

/**
 * Crée un buisson sur un bord spécifique
 */
function createEdgeBush(edge, container, bushTypes) {
    const bush = document.createElement('div');
    bush.className = 'jungle-edge-bush';
    
    // Position selon le bord
    let posX, posY, zIndex;
    
    switch (edge) {
        case 'top':
            posX = Math.random() * window.innerWidth;
            posY = -30;
            zIndex = 0;
            break;
        case 'bottom':
            posX = Math.random() * window.innerWidth;
            posY = window.innerHeight - 20;
            zIndex = 0;
            break;
        case 'left':
            posX = -60;
            posY = Math.random() * window.innerHeight;
            zIndex = 0;
            break;
        case 'right':
            posX = window.innerWidth - 60;
            posY = Math.random() * window.innerHeight;
            zIndex = 0;
            break;
    }
    
    // Type de buisson aléatoire
    const bushType = bushTypes[Math.floor(Math.random() * bushTypes.length)];
    bush.innerHTML = bushType;
    
    // Taille et rotation aléatoires
    const scale = 0.7 + Math.random() * 0.6;
    let rotation = Math.random() * 20 - 10;
    
    // Ajuster la rotation selon le bord
    if (edge === 'top') {
        rotation += 180; // Retourner pour le bord supérieur
    } else if (edge === 'left') {
        rotation -= 90; // Tourner vers la droite
    } else if (edge === 'right') {
        rotation += 90; // Tourner vers la gauche
    }
    
    // Style du buisson
    bush.style.cssText = `
        position: fixed;
        top: ${posY}px;
        left: ${posX}px;
        transform: rotate(${rotation}deg) scale(${scale});
        z-index: ${zIndex};
        opacity: ${0.8 + Math.random() * 0.2};
        filter: drop-shadow(0 3px 8px rgba(0,0,0,0.3));
    `;
    
    container.appendChild(bush);
}

/**
 * Ajoute des lianes décoratives plus nombreuses et plus complexes
 */
function addDecorativeVines() {
    // Container pour les lianes
    const vineContainer = document.createElement('div');
    vineContainer.className = 'jungle-vine-container';
    vineContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
    `;
    document.body.appendChild(vineContainer);
    
    // Coins où ajouter des lianes
    const corners = [
        { top: 0, left: 0, rotate: 0 },
        { top: 0, right: 0, rotate: 90 },
        { bottom: 0, left: 0, rotate: 270 },
        { bottom: 0, right: 0, rotate: 180 }
    ];
    
    // Types de lianes plus détaillées
    const vineTypes = [
        // Liane avec feuilles
        `<svg width="200" height="250" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
            <!-- Liane principale -->
            <path d="M10,10 Q60,50 40,100 T80,150 Q100,200 150,210" 
                  stroke="#5D4037" stroke-width="8" fill="none" 
                  stroke-linecap="round" />
                  
            <!-- Liane secondaire -->
            <path d="M10,10 Q40,70 70,90 T100,130 Q120,170 170,180" 
                  stroke="#6D4C41" stroke-width="5" fill="none" 
                  stroke-linecap="round" />
                  
            <!-- Feuilles sur la liane -->
            <g fill="#43b463">
                <path d="M40,40 Q30,30 40,20 Q50,30 40,40" />
                <path d="M50,60 Q40,50 50,40 Q60,50 50,60" />
                <path d="M60,80 Q50,70 60,60 Q70,70 60,80" />
                <path d="M50,100 Q40,90 50,80 Q60,90 50,100" />
                <path d="M70,120 Q60,110 70,100 Q80,110 70,120" />
                <path d="M90,140 Q80,130 90,120 Q100,130 90,140" />
                <path d="M100,160 Q90,150 100,140 Q110,150 100,160" />
                <path d="M110,180 Q100,170 110,160 Q120,170 110,180" />
                <path d="M130,200 Q120,190 130,180 Q140,190 130,200" />
            </g>
            
            <!-- Plus grandes feuilles -->
            <g>
                <path d="M40,50 Q20,60 10,40 Q30,20 50,40 Z" fill="#2d8e44" />
                <path d="M60,100 Q30,120 20,90 Q40,60 70,85 Z" fill="#3da55c" />
                <path d="M100,170 Q70,190 60,160 Q80,130 110,155 Z" fill="#2d8e44" />
            </g>
        </svg>`,
        
        // Liane avec plusieurs ramifications
        `<svg width="250" height="300" viewBox="0 0 250 300" xmlns="http://www.w3.org/2000/svg">
            <!-- Liane principale -->
            <path d="M20,20 Q70,70 80,150 T150,240" 
                  stroke="#5D4037" stroke-width="7" fill="none" />
                  
            <!-- Ramifications -->
            <path d="M50,50 Q70,30 100,40" 
                  stroke="#6D4C41" stroke-width="4" fill="none" />
                  
            <path d="M70,90 Q100,80 120,100" 
                  stroke="#6D4C41" stroke-width="4" fill="none" />
                  
            <path d="M80,140 Q110,130 130,150" 
                  stroke="#6D4C41" stroke-width="4" fill="none" />
                  
            <path d="M120,200 Q150,190 170,210" 
                  stroke="#6D4C41" stroke-width="4" fill="none" />
                  
            <!-- Feuilles -->
            <g>
                <path d="M100,40 Q120,20 140,30 Q130,50 100,40 Z" fill="#43b463" />
                <path d="M120,100 Q140,80 160,90 Q150,110 120,100 Z" fill="#3da55c" />
                <path d="M130,150 Q150,130 170,140 Q160,160 130,150 Z" fill="#43b463" />
                <path d="M170,210 Q190,190 210,200 Q200,220 170,210 Z" fill="#3da55c" />
            </g>
            
            <!-- Petites feuilles sur la liane principale -->
            <g fill="#2d8e44">
                <circle cx="30" cy="30" r="5" />
                <circle cx="60" cy="60" r="4" />
                <circle cx="75" cy="100" r="5" />
                <circle cx="80" cy="130" r="4" />
                <circle cx="90" cy="160" r="5" />
                <circle cx="110" cy="190" r="4" />
                <circle cx="130" cy="220" r="5" />
            </g>
        </svg>`,
        
        // Liane avec fleurs tropicales
        `<svg width="230" height="280" viewBox="0 0 230 280" xmlns="http://www.w3.org/2000/svg">
            <!-- Liane principale -->
            <path d="M30,30 Q80,90 70,160 T130,260" 
                  stroke="#6D4C41" stroke-width="6" fill="none" />
                  
            <!-- Feuilles -->
            <g>
                <path d="M50,60 Q30,40 50,20 Q70,40 50,60 Z" fill="#3da55c" />
                <path d="M60,100 Q40,80 60,60 Q80,80 60,100 Z" fill="#43b463" />
                <path d="M70,140 Q50,120 70,100 Q90,120 70,140 Z" fill="#3da55c" />
                <path d="M90,180 Q70,160 90,140 Q110,160 90,180 Z" fill="#43b463" />
                <path d="M110,220 Q90,200 110,180 Q130,200 110,220 Z" fill="#3da55c" />
            </g>
            
            <!-- Fleurs tropicales -->
            <g transform="translate(45, 50)">
                <circle cx="0" cy="0" r="8" fill="#FF9800" />
                <circle cx="0" cy="0" r="3" fill="#FFC107" />
                <path d="M0,-8 L0,-15 M8,0 L15,0 M0,8 L0,15 M-8,0 L-15,0" stroke="#FF9800" stroke-width="2" />
            </g>
            
            <g transform="translate(65, 130)">
                <circle cx="0" cy="0" r="8" fill="#FF9800" />
                <circle cx="0" cy="0" r="3" fill="#FFC107" />
                <path d="M0,-8 L0,-15 M8,0 L15,0 M0,8 L0,15 M-8,0 L-15,0" stroke="#FF9800" stroke-width="2" />
            </g>
            
            <g transform="translate(120, 210)">
                <circle cx="0" cy="0" r="8" fill="#FF9800" />
                <circle cx="0" cy="0" r="3" fill="#FFC107" />
                <path d="M0,-8 L0,-15 M8,0 L15,0 M0,8 L0,15 M-8,0 L-15,0" stroke="#FF9800" stroke-width="2" />
            </g>
        </svg>`
    ];
    
    // Ajouter des lianes à chaque coin
    corners.forEach((corner, index) => {
        // Nombre de lianes par coin (2-3)
        const vineCount = 2 + Math.floor(Math.random() * 2);
        
        for (let i = 0; i < vineCount; i++) {
            const vine = document.createElement('div');
            vine.className = 'jungle-vine';
            
            const positionStyle = Object.entries(corner)
                .filter(([key]) => key !== 'rotate')
                .map(([key, value]) => `${key}: ${value}px;`)
                .join(' ');
            
            // Décalage aléatoire
            const offsetX = (corner.right !== undefined) ? -Math.random() * 50 : Math.random() * 50;
            const offsetY = (corner.bottom !== undefined) ? -Math.random() * 50 : Math.random() * 50;
            
            // Type de liane aléatoire
            const vineType = vineTypes[Math.floor(Math.random() * vineTypes.length)];
            
            // Taille aléatoire
            const scale = 0.8 + Math.random() * 0.7;
            
            vine.innerHTML = vineType;
            
            vine.style.cssText = `
                position: fixed;
                ${positionStyle}
                transform: rotate(${corner.rotate}deg) scale(${scale}) translate(${offsetX}px, ${offsetY}px);
                pointer-events: none;
                z-index: 0;
                opacity: ${0.7 + Math.random() * 0.3};
                filter: drop-shadow(0 3px 8px rgba(0,0,0,0.3));
            `;
            
            vineContainer.appendChild(vine);
        }
        
        // Ajouter des lianes qui pendent du haut uniquement
        if (corner.top === 0 && Math.random() > 0.3) {
            // Nombre aléatoire de lianes pendantes (1-3)
            const hangingCount = 1 + Math.floor(Math.random() * 3);
            
            for (let i = 0; i < hangingCount; i++) {
                createHangingVine(vineContainer, corner);
            }
        }
    });
    
    // Ajouter quelques lianes le long des bords (pas seulement aux coins)
    addEdgeVines(vineContainer, vineTypes);
}

/**
 * Crée une liane qui pend du haut
 */
function createHangingVine(container, corner) {
    const vine = document.createElement('div');
    vine.className = 'jungle-hanging-vine';
    
    // Position le long du bord supérieur
    const posX = corner.left === 0 
                ? Math.random() * (window.innerWidth / 3) 
                : window.innerWidth - Math.random() * (window.innerWidth / 3);
                
    // SVG de liane pendante
    vine.innerHTML = `
        <svg width="50" height="300" viewBox="0 0 50 300" xmlns="http://www.w3.org/2000/svg">
            <!-- Liane principale -->
            <path d="M25,0 C30,50 20,100 25,150 C30,200 20,250 25,300" 
                  stroke="#5D4037" stroke-width="5" fill="none" />
                  
            <!-- Petites lianes -->
            <path d="M25,50 C35,55 45,50 50,45" stroke="#6D4C41" stroke-width="3" fill="none" />
            <path d="M25,100 C15,105 5,100 0,95" stroke="#6D4C41" stroke-width="3" fill="none" />
            <path d="M25,150 C35,155 45,150 50,145" stroke="#6D4C41" stroke-width="3" fill="none" />
            <path d="M25,200 C15,205 5,200 0,195" stroke="#6D4C41" stroke-width="3" fill="none" />
            
            <!-- Petites feuilles -->
            <g fill="#3da55c">
                <path d="M50,45 Q55,40 60,45 Q55,50 50,45 Z" />
                <path d="M0,95 Q-5,90 -10,95 Q-5,100 0,95 Z" />
                <path d="M50,145 Q55,140 60,145 Q55,150 50,145 Z" />
                <path d="M0,195 Q-5,190 -10,195 Q-5,200 0,195 Z" />
            </g>
            
            <!-- Feuilles sur la liane principale -->
            <g>
                <path d="M25,75 Q35,70 40,80 Q30,85 25,75 Z" fill="#43b463" />
                <path d="M25,125 Q15,120 10,130 Q20,135 25,125 Z" fill="#43b463" />
                <path d="M25,175 Q35,170 40,180 Q30,185 25,175 Z" fill="#43b463" />
                <path d="M25,225 Q15,220 10,230 Q20,235 25,225 Z" fill="#43b463" />
                <path d="M25,275 Q35,270 40,280 Q30,285 25,275 Z" fill="#43b463" />
            </g>
        </svg>
    `;
    
    // Longueur aléatoire
    const length = 100 + Math.random() * 200;
    const scale = 1 + Math.random() * 0.5;
    
    vine.style.cssText = `
        position: fixed;
        top: 0;
        left: ${posX}px;
        height: ${length}px;
        transform: scale(${scale});
        pointer-events: none;
        z-index: 0;
        opacity: ${0.8 + Math.random() * 0.2};
        animation: vine-sway ${3 + Math.random() * 2}s ease-in-out infinite alternate;
        transform-origin: top center;
    `;
    
    // Animation de balancement
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    const swayAmount = 5 + Math.random() * 10;
    styleSheet.innerText = `
        @keyframes vine-sway {
            0% { transform: scale(${scale}) rotate(${-swayAmount}deg); }
            100% { transform: scale(${scale}) rotate(${swayAmount}deg); }
        }
    `;
    document.head.appendChild(styleSheet);
    
    container.appendChild(vine);
}

/**
 * Ajoute des lianes le long des bords (pas seulement aux coins)
 */
function addEdgeVines(container, vineTypes) {
    // Bords où placer des lianes
    const edges = [
        { edge: 'top', count: 2 + Math.floor(Math.random() * 2) },
        { edge: 'left', count: 1 + Math.floor(Math.random() * 2) },
        { edge: 'right', count: 1 + Math.floor(Math.random() * 2) }
    ];
    
    edges.forEach(({ edge, count }) => {
        for (let i = 0; i < count; i++) {
            const vine = document.createElement('div');
            vine.className = 'jungle-edge-vine';
            
            // Position selon le bord
            let posX, posY, rotation;
            
            if (edge === 'top') {
                posX = window.innerWidth * 0.2 + Math.random() * (window.innerWidth * 0.6);
                posY = 0;
                rotation = 180 + Math.random() * 30 - 15;
            } else if (edge === 'left') {
                posX = 0;
                posY = window.innerHeight * 0.2 + Math.random() * (window.innerHeight * 0.6);
                rotation = 270 + Math.random() * 30 - 15;
            } else { // right
                posX = window.innerWidth;
                posY = window.innerHeight * 0.2 + Math.random() * (window.innerHeight * 0.6);
                rotation = 90 + Math.random() * 30 - 15;
            }
            
            // Type de liane aléatoire
            const vineType = vineTypes[Math.floor(Math.random() * vineTypes.length)];
            vine.innerHTML = vineType;
            
            // Taille aléatoire
            const scale = 0.6 + Math.random() * 0.5;
            
            vine.style.cssText = `
                position: fixed;
                top: ${posY}px;
                left: ${posX}px;
                transform: rotate(${rotation}deg) scale(${scale});
                pointer-events: none;
                z-index: 0;
                opacity: ${0.6 + Math.random() * 0.4};
                filter: drop-shadow(0 3px 6px rgba(0,0,0,0.2));
            `;
            
            container.appendChild(vine);
        }
    });
}

// Ajouter des styles CSS pour les nouveaux éléments
function addJungleStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = `
        /* Assurer que le contenu principal est au-dessus des décorations */
        .navbar, .container, main, .section-header, .service-card, 
        .stat-card, .modal-content, footer, .toast {
            position: relative;
            z-index: 5;
        }
        
        /* Style pour s'assurer que le contenu interactif reste toujours accessible */
        button, a, input, select, textarea, .card-link, .navbar-brand, .navbar-config-btn {
            position: relative;
            z-index: 10;
        }
        /* Styles pour le cadre de feuillage */
        .jungle-frame-leaf {
            transition: filter 0.3s ease;
        }
        
        .jungle-frame-leaf:hover {
            filter: brightness(1.2) drop-shadow(0 5px 10px rgba(0,0,0,0.4));
        }
        
        /* Styles pour les buissons */
        .jungle-edge-bush, .jungle-corner-bush {
            transition: all 0.5s ease;
        }
        
        /* Animation de balancement pour les éléments végétaux */
        @keyframes leaf-sway {
            0% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(5px, 2px) rotate(3deg); }
            100% { transform: translate(-2px, -2px) rotate(-2deg); }
        }
        
        /* Animation spécifique pour les lianes pendantes */
        @keyframes vine-sway {
            0% { transform: rotate(-5deg); }
            100% { transform: rotate(5deg); }
        }
        
        /* Style pour les lianes */
        .jungle-vine, .jungle-edge-vine, .jungle-hanging-vine {
            transition: opacity 0.3s ease;
        }
        
        /* Lors du chargement de la page, démarrer avec une opacité réduite */
        body:not(.jungle-theme-loaded) .jungle-frame-leaf,
        body:not(.jungle-theme-loaded) .jungle-edge-bush,
        body:not(.jungle-theme-loaded) .jungle-corner-bush,
        body:not(.jungle-theme-loaded) .jungle-vine,
        body:not(.jungle-theme-loaded) .jungle-edge-vine,
        body:not(.jungle-theme-loaded) .jungle-hanging-vine {
            opacity: 0;
        }
        
        /* Transition d'opacité lorsque le thème est chargé */
        body.jungle-theme-loaded .jungle-frame-leaf,
        body.jungle-theme-loaded .jungle-edge-bush,
        body.jungle-theme-loaded .jungle-corner-bush,
        body.jungle-theme-loaded .jungle-vine,
        body.jungle-theme-loaded .jungle-edge-vine,
        body.jungle-theme-loaded .jungle-hanging-vine {
            opacity: 1;
            transition: opacity 1s ease-in;
        }
    `;
    document.head.appendChild(styleSheet);
}

// Ajout de l'initialisation des styles
document.addEventListener('DOMContentLoaded', function() {
    addJungleStyles();
});