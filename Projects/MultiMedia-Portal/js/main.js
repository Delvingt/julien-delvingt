/**
 * Portail Multimédia - Script principal
 */
// ======================================================
// CONFIGURATION ET INITIALISATION GLOBALE
// ======================================================

// Attend que le DOM soit complètement chargé avant d'exécuter le code
document.addEventListener('DOMContentLoaded', function() {
    // Détecte si l'appareil est mobile
    const isMobile = window.innerWidth <= 768;
    
    // Initialise toutes les fonctionnalités
    initNotifications();
    initAuthenticationModal();
    initSearchSystem();
    initViewToggle();
    initFavorites();
    initServiceCards();
    
    // Initialise le sélecteur de thème et capture l'objet retourné (une seule fois)
    const themeManager = initThemeSelector();
    
    // Ajoute un écouteur d'événement pour le bouton d'options de thème
    const themeOptionsBtn = document.getElementById('ThemeOptionsBtn');
    if (themeOptionsBtn && themeManager) {
        themeOptionsBtn.addEventListener('click', function() {
            themeManager.openModal();
        });
    }
    
    // Pas besoin d'utiliser onThemeChange ici, car updateInterfaceForTheme 
    // est déjà utilisé comme callback dans initThemeSelector()
    
    // Si mobile, initialise les optimisations spécifiques
    if (isMobile) {
        initMobileOptimizations();
    }
    
    // Afficher un toast de bienvenue au chargement
    showToast('Bienvenue', 'Portail multimédia prêt à l\'utilisation !', 'success');
});

// ======================================================
// GESTIONNAIRE DE THÈME
// ======================================================
function initThemeSelector() {
    // Éléments du DOM
    const modal = document.getElementById('theme-selector-modal');
    if (!modal) {
        console.error("Modal de sélection de thème non trouvé dans le DOM");
        return null; // Retourner null si le modal n'existe pas
    }
    
    const closeBtn = document.querySelector('.theme-modal-close');
    const saveBtn = document.getElementById('theme-selector-save');
    const themeItems = document.querySelectorAll('.theme-item');

    // Vérifier si des éléments '.theme-item' existent
    if (themeItems.length === 0) {
        console.error("Aucun élément de thème trouvé dans le modal");
        return null;
    }
    
    let selectedTheme = document.querySelector('.theme-selected')?.dataset.themeId || 'default';
    let themeCallbacks = []; // Pour stocker les fonctions callback
    
    // Fonction pour ouvrir le modal
    function openThemeModal() {
        modal.style.display = 'block';
        console.log("Modal de thème ouvert");
    }
    
    // Fermer le modal
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            console.log("Modal de thème fermé via bouton de fermeture");
        });
    } else {
        console.warn("Bouton de fermeture du modal non trouvé");
    }
    
    // Fermer le modal en cliquant à l'extérieur
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            console.log("Modal de thème fermé via clic extérieur");
        }
    });
    
    // Sélectionner un thème
    themeItems.forEach(function(item) {
        item.addEventListener('click', function() {
            // Supprimer la classe selected de tous les items
            themeItems.forEach(i => i.classList.remove('theme-selected'));
            
            // Ajouter la classe selected à l'item cliqué
            this.classList.add('theme-selected');
            
            // Stocker l'ID du thème sélectionné
            selectedTheme = this.dataset.themeId;
            console.log("Thème sélectionné:", selectedTheme);
        });
    });
    
    // Appliquer le thème sélectionné
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            // Vérifier si un thème est sélectionné
            if (!selectedTheme) {
                console.error("Aucun thème sélectionné");
                showToast('Erreur', 'Aucun thème sélectionné', 'error');
                return;
            }
            
            console.log("Enregistrement du thème:", selectedTheme);
            
            try {
                // Définir le cookie
                document.cookie = 'theme=' + selectedTheme + '; max-age=' + (86400 * 30) + '; path=/';
                console.log("Cookie défini:", document.cookie);
                
                // Récupérer les infos du thème sélectionné
                const themeNameElement = document.querySelector(`.theme-item[data-theme-id="${selectedTheme}"] .theme-info h3`);
                if (!themeNameElement) {
                    console.error("Élément de nom de thème non trouvé");
                    showToast('Erreur', 'Impossible de trouver les informations du thème', 'error');
                    return;
                }
                
                const themeInfo = {
                    id: selectedTheme,
                    nom: themeNameElement.textContent
                };
                
                // Notifier les abonnés du changement de thème
                notifyThemeChange(themeInfo.id, themeInfo);
                
                // Fermer le modal
                modal.style.display = 'none';
                
                // Afficher un toast de confirmation avant de recharger
                showToast('Thème', `Thème "${themeInfo.nom}" appliqué`, 'success');
                
                // Recharger la page pour appliquer le thème (avec un léger délai pour que le toast soit visible)
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } catch (error) {
                console.error("Erreur lors de l'enregistrement du thème:", error);
                showToast('Erreur', 'Impossible d\'appliquer le thème', 'error');
            }
        });
    } else {
        console.error("Bouton d'enregistrement non trouvé");
    }
    
    /**
     * S'abonne aux changements de thème
     * @param {Function} callback - Fonction à appeler lors d'un changement de thème
     */
    function onThemeChange(callback) {
        if (typeof callback === 'function') {
            themeCallbacks.push(callback);
        }
    }
    
    /**
     * Notifie tous les abonnés d'un changement de thème
     * @param {string} themeId - Identifiant du nouveau thème
     * @param {Object} theme - Données du thème
     */
    function notifyThemeChange(themeId, theme) {
        themeCallbacks.forEach(callback => callback(themeId, theme));
    }
    
    /**
     * Met à jour l'interface en fonction du thème sélectionné
     * @param {string} themeId - Identifiant du thème
     * @param {Object} theme - Données du thème
     */
    function updateInterfaceForTheme(themeId, theme) {
        // Supprimer les classes de thème existantes
        document.body.classList.remove('theme-dark', 'theme-light', 'theme-blue');
        
        // Ajouter la classe du nouveau thème
        document.body.classList.add('theme-' + themeId);
        
        // Afficher une notification
        if (window.showToast) {
            window.showToast('Thème', `Thème "${theme.nom}" appliqué`, 'success');
        }
    }
    
    // Ajouter updateInterfaceForTheme comme premier callback
    onThemeChange(updateInterfaceForTheme);
    
    // Exposer les fonctions publiques
    return {
        openModal: openThemeModal,
        onThemeChange: onThemeChange
    };
}

// ======================================================
// SYSTÈME DE NOTIFICATIONS (TOASTS)
// ======================================================

/**
 * Initialise le système de notifications toast
 */
function initNotifications() {
    // Exposer la fonction showToast à la portée globale
    window.showToast = showToast;
}

/**
 * Affiche une notification toast avec le titre, message et type donnés
 * @param {string} title - Titre de la notification
 * @param {string} message - Message de la notification
 * @param {string} type - Type de notification ('info', 'success', 'error', 'warning')
 */
function showToast(title, message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const isMobile = window.innerWidth <= 768;
    
    // Vérifier le nombre de toasts actuels
    const existingToasts = toastContainer.querySelectorAll('.toast');
    
    // Limiter le nombre de toasts selon le périphérique
    const maxToasts = isMobile ? 2 : 3;
    
    // Si trop de toasts, supprimer le plus ancien
    if (existingToasts.length >= maxToasts) {
        const oldestToast = existingToasts[0];
        oldestToast.classList.add('toast-exiting');
        setTimeout(() => {
            oldestToast.remove();
        }, 300);
    }
    
    // Créer le nouveau toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    // Définir l'icône selon le type de notification
    let iconClass = 'fas fa-info-circle';
    if (type === 'success') iconClass = 'fas fa-check-circle';
    if (type === 'error') iconClass = 'fas fa-exclamation-circle';
    if (type === 'warning') iconClass = 'fas fa-exclamation-triangle';
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="${iconClass}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    // Ajouter le toast au conteneur
    toastContainer.appendChild(toast);
    
    // Durée plus courte sur mobile
    const toastDuration = isMobile ? 4000 : 5000;
    
    // Supprimer le toast après la durée définie
    setTimeout(() => {
        toast.classList.add('toast-exiting');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, toastDuration);
    
    // Ajouter la possibilité de glisser pour fermer le toast sur mobile
    if (isMobile) {
        let startX, startY, distX, distY;
        let threshold = 100; // Distance minimale pour considérer comme un swipe
        
        toast.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, false);
        
        toast.addEventListener('touchmove', function(e) {
            distX = e.touches[0].clientX - startX;
            distY = e.touches[0].clientY - startY;
            
            // Si le déplacement horizontal est plus grand que vertical et vers la droite
            if (Math.abs(distX) > Math.abs(distY) && distX > 0) {
                e.preventDefault(); // Empêche le défilement de la page
                toast.style.transform = `translateX(${distX}px)`;
            }
        }, false);
        
        toast.addEventListener('touchend', function(e) {
            if (distX > threshold) {
                // Swipe suffisamment long pour fermer le toast
                toast.style.transition = 'transform 0.3s ease';
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    toast.remove();
                }, 300);
            } else {
                // Pas assez de distance, on remet le toast à sa place
                toast.style.transition = 'transform 0.3s ease';
                toast.style.transform = 'translateX(0)';
            }
        }, false);
    }
}

// ======================================================
// AUTHENTICATION ET MODAL DE CONNEXION
// ======================================================

/**
 * Initialise la modal d'authentification et les boutons connexes
 */
function initAuthenticationModal() {
    // Récupération des éléments DOM
    const modal = document.getElementById('loginModal');
    if (!modal) return;
    
    const loginBtn = document.getElementById('LoginBtn');
    const logoutBtn = document.getElementById('LogoutBtn');
    const closeBtn = document.querySelector('.close-btn');
    
    // Afficher la modal quand on clique sur le cadenas verrouillé (pour se connecter)
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            modal.style.display = 'block';
        });
    }

    // Se déconnecter quand on clique sur le cadenas déverrouillé
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            window.location.href = '?logout=1';
        });
    }
    
    // Fermer la modal quand on clique sur le X
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Fermer la modal quand on clique en dehors
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Vérifier s'il y a une erreur de mot de passe
    // Si la variable PHP passwordError est définie, la modal s'affichera automatiquement
    const showModalOnError = document.getElementById('showModalOnError');
    if (showModalOnError && showModalOnError.value === '1') {
        modal.style.display = 'block';
    }
}

// ======================================================
// SYSTÈME DE RECHERCHE
// ======================================================

/**
 * Initialise le système de recherche de services
 */
function initSearchSystem() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    const isMobile = window.innerWidth <= 768;
    
    // Optimisation avec throttling/debouncing pour mobile
    let searchTimeout;
    searchInput.addEventListener('input', function(e) {
        // Efface le timeout précédent
        clearTimeout(searchTimeout);
        
        // Augmente légèrement la taille de la police pendant la frappe sur mobile
        if (isMobile) {
            this.style.fontSize = '1.05rem';
        }
        
        // Définit un nouveau timeout pour réduire le nombre d'actualisations
        const delay = isMobile ? 300 : 100; // Délai plus long sur mobile
        searchTimeout = setTimeout(() => {
            performSearch(e.target.value.toLowerCase());
        }, delay);
    });
    
    // Réinitialiser la taille de police après la frappe sur mobile
    if (isMobile) {
        searchInput.addEventListener('blur', function() {
            this.style.fontSize = '';
        });
    }
}

/**
 * Effectue la recherche et met à jour l'affichage
 * @param {string} query - Texte de recherche
 */
function performSearch(query) {
    const allCards = document.querySelectorAll('.service-card');
    const isMobile = window.innerWidth <= 768;
    let matchCount = 0;
    
    allCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const description = card.querySelector('.card-description')?.textContent.toLowerCase() || '';
        
        if (title.includes(query) || description.includes(query)) {
            card.style.display = '';
            // Animation subtile pour les résultats qui correspondent
            if (isMobile) {
                card.style.animation = 'fadeInUp 0.3s forwards';
            }
            matchCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Affiche le toast seulement si la requête est significative
    // Sur mobile, exiger 2 caractères minimum pour réduire les notifications
    const minQueryLength = isMobile ? 2 : 1;
    if (query && query.length >= minQueryLength) {
        showToast('Recherche', `${matchCount} service(s) trouvé(s) pour "${query}"`, matchCount > 0 ? 'success' : 'warning');
    }
    
    // Ajustement du layout pour mobile si nécessaire
    if (isMobile) {
        setTimeout(adjustSectionLayout, 400);
    }
}

// ======================================================
// SYSTÈME DE VUES (LISTE/GRILLE)
// ======================================================

/**
 * Initialise les boutons de basculement entre les vues liste et grille
 */
function initViewToggle() {
    const viewButtons = document.querySelectorAll('.view-toggle .view-btn');
    if (viewButtons.length === 0) return;
    
    const isMobile = window.innerWidth <= 768;
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const viewType = this.dataset.view;
            const sectionHeader = this.closest('.section-header');
            const container = sectionHeader.nextElementSibling;
            
            // Mise à jour des boutons
            sectionHeader.querySelectorAll('.view-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            // Mise à jour de la vue
            if (viewType === 'list') {
                container.classList.add('list-view');
            } else {
                container.classList.remove('list-view');
            }
            
            // Notification du changement de vue
            if (isMobile) {
                showToast('Affichage modifié', `Vue en ${viewType === 'list' ? 'liste' : 'grille'} activée`);
            }
        });
    });
}

// ======================================================
// SYSTÈME DE FAVORIS
// ======================================================

/**
 * Initialise le système de gestion des favoris
 */
function initFavorites() {
    // Délégation d'événements pour les boutons favoris
    document.addEventListener('click', function(e) {
        if (e.target.closest('.favorite-btn')) {
            e.preventDefault();
            const btn = e.target.closest('.favorite-btn');
            const serviceId = btn.dataset.id;
            
            // Inverser l'état
            btn.classList.toggle('active');
            const isFavorite = btn.classList.contains('active');
            
            // Récupérer la carte de service complète
            const serviceCard = btn.closest('.service-card');
            
            // Retour tactile sur mobile
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                serviceCard.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    serviceCard.style.transform = '';
                }, 200);
            }
            
            // Mettre à jour les cookies
            updateFavorites(serviceId, isFavorite);
            
            // Mettre à jour l'interface utilisateur des favoris
            updateFavoritesUI(serviceCard, isFavorite);
            
            // Mettre à jour le compteur de favoris
            updateFavoriteCount();
            
            // Afficher un toast
            showToast(
                'Favoris', 
                isFavorite ? 
                    `Service ajouté aux favoris` : 
                    `Service retiré des favoris`,
                isFavorite ? 'success' : 'info'
            );
        }
    });
}

// ======================================================
// CARTES DE SERVICES ET INTERACTIONS
// ======================================================

/**
 * Initialise toutes les cartes de services avec leurs interactions
 */
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length === 0) return;
    
    const isMobile = window.innerWidth <= 768;
    
    serviceCards.forEach(card => {
        // Améliore l'accessibilité des boutons favoris sur mobile
        if (isMobile) {
            const favoriteBtn = card.querySelector('.favorite-btn');
            if (favoriteBtn) {
                favoriteBtn.style.padding = '10px';
                favoriteBtn.style.margin = '-10px';
            }
        }
        
        // Gestion des événements tactiles sur mobile
        if (isMobile) {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
                this.style.transition = 'transform 0.2s';
            });
            
            card.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
                setTimeout(() => {
                    this.style.transition = 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
                }, 200);
            });
        }
        
        // Rendre la carte cliquable
        card.addEventListener('click', function(e) {
            // Si le clic n'est pas sur le bouton favori ou le lien
            if (!e.target.closest('.favorite-btn') && !e.target.closest('.card-link')) {
                // Trouver le lien dans cette carte et simuler un clic
                const link = this.querySelector('.card-link');
                if (link) {
                    // Ouvrir dans un nouvel onglet
                    window.open(link.href, '_blank');
                }
            }
        });
    });

    // Ajouter des effets aux cartes de service
    enhanceServiceCards();
}

/**
 * Ajoute des effets d'interactivité aux cartes de service
 */
function enhanceServiceCards() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        // Effet de parallaxe léger
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const moveX = (x - centerX) / 20;
            const moveY = (y - centerY) / 20;
            
            this.style.transform = `perspective(800px) rotateY(${moveX}deg) rotateX(${-moveY}deg) translateZ(10px)`;
        });
        
        // Réinitialisation quand la souris quitte la carte
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            setTimeout(() => {
                this.style.transition = 'transform 0.3s ease';
            }, 300);
        });
        
        // Désactiver la transition pendant le survol pour un effet fluide
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'none';
        });
    });
}

// ======================================================
// OPTIMISATIONS MOBILES
// ======================================================

/**
 * Initialise les optimisations spécifiques aux appareils mobiles
 */
function initMobileOptimizations() {
    // Ajustement automatique des sections en fonction du nombre de services
    adjustSectionLayout();
    
    // Détection du "double tap" sur la navbar pour remonter en haut de page
    initDoubleTapToTop();
}

// Reste des fonctions pour les optimisations mobiles...