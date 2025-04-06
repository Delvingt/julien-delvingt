// Fichier JavaScript complet avec toutes les modifications

document.addEventListener('DOMContentLoaded', function() {
    // Animation des barres de compétence
    animateSkillBars();
    
    // Effet de frappe amélioré pour le nom et le titre
    enhancedTypeWriter('typing-name', 'Julien Delvingt', 100);
    setTimeout(() => {
        enhancedTypeWriter('typing-title', 'Industrial Digitalization Engineer', 50);
    }, 1000);
    
    // Animation des sections au scroll
    animateSectionsOnScroll();
    
    // Nouvelles fonctionnalités
    initDigitalBackground();
    addDataBursts();
    addTechGlitch();
    addCardScanEffect();
    createParticles();
    
    // Ajouter une classe pour les animations CSS
    document.body.classList.add('digital-theme');
});

// Animation des barres de compétence
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-progress');
        
        // Delay pour déclencher l'animation après le chargement initial
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 500);
    });
}

// Effet de frappe amélioré pour le texte
function enhancedTypeWriter(elementId, text, speed) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = '';
    
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    element.appendChild(cursor);
    
    // Couleurs pour l'effet de texte
    const colors = ['#4e7ae2', '#4a90e2', '#18c89b'];
    let colorIndex = 0;
    
    function type() {
        if (i < text.length) {
            const charSpan = document.createElement('span');
            // Changer la couleur occasionnellement pour certains caractères
            if (text.charAt(i) !== ' ' && Math.random() > 0.7) {
                charSpan.style.color = colors[colorIndex % colors.length];
                colorIndex++;
            }
            charSpan.textContent = text.charAt(i);
            element.insertBefore(charSpan, cursor);
            i++;
            setTimeout(type, speed);
        } else {
            // Effet de scan après la fin du typing
            setTimeout(() => {
                const scanOverlay = document.createElement('div');
                scanOverlay.className = 'scan-effect';
                element.appendChild(scanOverlay);
                
                setTimeout(() => {
                    scanOverlay.remove();
                    element.removeChild(cursor);
                }, 1500);
            }, 500);
        }
    }
    
    type();
}

// Animation des sections au scroll
function animateSectionsOnScroll() {
    const sections = document.querySelectorAll('.section');
    const processSteps = document.querySelectorAll('.process-step');
    
    // Fonction pour vérifier si un élément est visible dans le viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }
    
    // Fonction pour ajouter la classe d'animation
    function checkVisibility() {
        sections.forEach(section => {
            if (isElementInViewport(section)) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
                section.classList.add('appear');
            }
        });
        
        // Animer les étapes du processus vertical séquentiellement
        processSteps.forEach((step, index) => {
            if (isElementInViewport(step)) {
                setTimeout(() => {
                    step.classList.add('appear');
                }, index * 300); // Délai séquentiel pour chaque étape
            }
        });
    }
    
    // Initialisation des styles
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
    
    // Vérification initiale
    checkVisibility();
    
    // Vérification au scroll
    window.addEventListener('scroll', checkVisibility);
}

// Animation des cartes au survol
function animateCards() {
    const cards = document.querySelectorAll('.experience-item, .project-card, .certification-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 8px 20px rgba(78, 122, 226, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
        });
    });
}

// Fonction d'initialisation du fond d'écran dynamique
function initDigitalBackground() {
    // Créer l'élément canvas pour le fond d'écran dynamique
    const canvas = document.createElement('canvas');
    canvas.id = 'background-canvas';
    
    // Styles pour le canvas
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-2';
    canvas.style.opacity = '0.4';
    
    // Insérer le canvas au début du body pour qu'il soit en arrière-plan
    document.body.insertBefore(canvas, document.body.firstChild);
    
    // Ajouter les éléments de circuit diagonaux
    const circuitDiagonal = document.createElement('div');
    circuitDiagonal.className = 'circuit-diagonal';
    document.body.insertBefore(circuitDiagonal, document.body.firstChild);
    
    const ctx = canvas.getContext('2d');
    
    // Redimensionner le canvas pour qu'il occupe toute la fenêtre
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Appeler resizeCanvas initialement et à chaque redimensionnement de la fenêtre
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Configuration des noeuds et des connexions
    const nodes = [];
    const nodeCount = Math.floor(window.innerWidth / 100); // Nombre de nœuds basé sur la largeur de l'écran
    const connectionDistance = 150; // Distance maximale pour établir une connexion entre deux nœuds
    const nodeSize = 2; // Taille des nœuds
    const primaryColor = '#3a6ad4'; // Couleur principale (bleu)
    const accentColor = '#0bb588'; // Couleur d'accent (vert-bleu)
    
    // Créer les nœuds initiaux
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5, // Vitesse sur l'axe X
            vy: (Math.random() - 0.5) * 0.5, // Vitesse sur l'axe Y
            size: nodeSize + Math.random() * 1.5,
            color: Math.random() > 0.8 ? accentColor : primaryColor,
            dataFlow: Math.random() > 0.7
        });
    }
    
    // Particules de données (effet de flux)
    const dataParticles = [];
    
    // Fonction pour trouver les connexions entre nœuds
    function findConnections() {
        const connections = [];
        
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    connections.push({
                        from: i,
                        to: j,
                        distance: distance,
                        opacity: 1 - (distance / connectionDistance)
                    });
                    
                    // Ajouter des particules de données sur certaines connexions
                    if (nodes[i].dataFlow && Math.random() > 0.995) {
                        const progress = Math.random();
                        dataParticles.push({
                            fromX: nodes[i].x,
                            fromY: nodes[i].y,
                            toX: nodes[j].x,
                            toY: nodes[j].y,
                            progress: progress,
                            speed: 0.005 + Math.random() * 0.01,
                            size: 1 + Math.random() * 2,
                            color: Math.random() > 0.3 ? primaryColor : accentColor
                        });
                    }
                }
            }
        }
        
        return connections;
    }
    
    // Fonction d'animation principale
    function animate() {
        // Effacer le canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Mettre à jour la position des nœuds
        nodes.forEach(node => {
            // Rebondir sur les bords
            if (node.x <= 0 || node.x >= canvas.width) node.vx *= -1;
            if (node.y <= 0 || node.y >= canvas.height) node.vy *= -1;
            
            // Mettre à jour la position
            node.x += node.vx;
            node.y += node.vy;
        });
        
        // Trouver les connexions actives
        const connections = findConnections();
        
        // Dessiner les connexions
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
        
        // Dessiner les nœuds
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
            ctx.fillStyle = node.color;
            ctx.fill();
            
            // Ajouter un léger halo pour certains nœuds
            if (Math.random() > 0.95) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(58, 106, 212, ${Math.random() * 0.08})`;
                ctx.fill();
            }
        });
        
        // Mettre à jour et dessiner les particules de données
        for (let i = dataParticles.length - 1; i >= 0; i--) {
            const particle = dataParticles[i];
            
            // Mettre à jour la progression
            particle.progress += particle.speed;
            
            // Supprimer la particule si elle a atteint la fin
            if (particle.progress >= 1) {
                dataParticles.splice(i, 1);
                continue;
            }
            
            // Calculer la position actuelle
            const currentX = particle.fromX + (particle.toX - particle.fromX) * particle.progress;
            const currentY = particle.fromY + (particle.toY - particle.fromY) * particle.progress;
            
            // Dessiner la particule
            ctx.beginPath();
            ctx.arc(currentX, currentY, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        }
        
        // Ajouter occasionnellement de nouvelles particules pour les effets de "data burst"
        if (Math.random() > 0.98) {
            const sourceNode = nodes[Math.floor(Math.random() * nodes.length)];
            const burstCount = 3 + Math.floor(Math.random() * 5);
            
            for (let i = 0; i < burstCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = 50 + Math.random() * 100;
                
                const targetX = sourceNode.x + Math.cos(angle) * distance;
                const targetY = sourceNode.y + Math.sin(angle) * distance;
                
                dataParticles.push({
                    fromX: sourceNode.x,
                    fromY: sourceNode.y,
                    toX: targetX,
                    toY: targetY,
                    progress: 0,
                    speed: 0.01 + Math.random() * 0.02,
                    size: 1 + Math.random() * 1.5,
                    color: Math.random() > 0.3 ? primaryColor : accentColor
                });
            }
        }
        
        // Continuer l'animation
        requestAnimationFrame(animate);
    }
    
    // Démarrer l'animation
    animate();
}

// Ajouter des "data bursts" aléatoires sur la page
function addDataBursts() {
    const burstContainer = document.createElement('div');
    burstContainer.className = 'data-bursts';
    document.body.appendChild(burstContainer);
    
    // Créer des bursts à intervalles aléatoires
    setInterval(() => {
        if (Math.random() > 0.7) {
            const burst = document.createElement('div');
            burst.className = 'data-burst';
            
            // Position aléatoire
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            
            burst.style.left = `${x}px`;
            burst.style.top = `${y}px`;
            
            // Couleur aléatoire
            const colors = ['#4e7ae2', '#18c89b', '#4a90e2'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            burst.style.backgroundColor = color;
            
            // Taille aléatoire
            const size = 20 + Math.random() * 40;
            burst.style.width = `${size}px`;
            burst.style.height = `${size}px`;
            
            burstContainer.appendChild(burst);
            
            // Supprimer après l'animation
            setTimeout(() => {
                burst.remove();
            }, 1000);
        }
    }, 500);
}

// Effet de scintillement pour les compétences techniques
function addTechGlitch() {
    const techElements = document.querySelectorAll('.process-skill, .tag');
    
    techElements.forEach(element => {
        // Ajouter une chance aléatoire de scintillement
        setInterval(() => {
            if (Math.random() > 0.95) {
                element.classList.add('tech-glitch');
                
                setTimeout(() => {
                    element.classList.remove('tech-glitch');
                }, 200 + Math.random() * 300);
            }
        }, 3000);
    });
}

// Effet de "scan" sur les cartes au survol
function addCardScanEffect() {
    const cards = document.querySelectorAll('.experience-item, .project-card, .education-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const scanLine = document.createElement('div');
            scanLine.className = 'card-scan-line';
            this.appendChild(scanLine);
            
            // Supprimer après l'animation
            setTimeout(() => {
                scanLine.remove();
            }, 800);
        });
    });
}

// Création de particules flottantes
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);
    
    // Créer des particules
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Position aléatoire
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Animation différée
        particle.style.animationDelay = `${Math.random() * 20}s`;
        
        // Taille aléatoire
        const size = 1 + Math.random() * 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Opacité aléatoire
        particle.style.opacity = 0.2 + Math.random() * 0.5;
        
        particlesContainer.appendChild(particle);
    }
}