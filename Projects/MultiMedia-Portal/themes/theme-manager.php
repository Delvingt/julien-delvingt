<?php
/**
 * Système de sélection de thèmes
 * Ce fichier contient les fonctions nécessaires pour gérer la sélection et le chargement de thèmes
 */

/**
 * Liste des thèmes disponibles
 * Format: 'id_theme' => [
 *     'nom' => 'Nom du thème',
 *     'description' => 'Description du thème',
 *     'preview' => 'chemin/vers/apercu.jpg',
 *     'css' => ['chemin/vers/fichier1.css', 'chemin/vers/fichier2.css'],
 *     'js' => ['chemin/vers/fichier1.js', 'chemin/vers/fichier2.js']
 * ]
 */
function getThemes() {
    return [
        'default' => [
            'nom'           => 'Défaut',
            'preview'       => 'themes/default/default-theme.jpg',
            'css'           => [],
            'js'            => []
        ],
        'galactic' => [
            'nom'           => 'Galactique',
            'preview'       => 'themes/galactic/galactic-theme.jpg',
            'css'           => ['themes/galactic/galactic-theme.css'],
            'js'            => ['themes/galactic/galactic-theme.js']
        ],
        'neons' => [
            'nom'           => 'Néons',
            'preview'       => 'themes/neons/neons-theme.jpg',
            'css'           => ['themes/neons/neons-theme.css'],
            'js'            => ['themes/neons/neons-theme.js']
        ],
        'ocean' => [
            'nom'           => 'Océan',
            'preview'       => 'themes/ocean/ocean-theme.jpg',
            'css'           => ['themes/ocean/ocean-theme.css'],
            'js'            => ['themes/ocean/ocean-theme.js']
        ],
        'jungle' => [
            'nom'           => 'Jungle',
            'preview'       => 'themes/jungle/jungle-theme.jpg',
            'css'           => ['themes/jungle/jungle-theme.css'],
            'js'            => ['themes/jungle/jungle-theme.js']
        ],
        'cloud' => [
            'nom'           => 'Nuages',
            'preview'       => 'themes/cloud/cloud-theme.jpg',
            'css'           => ['themes/cloud/cloud-theme.css'],
            'js'            => ['themes/cloud/cloud-theme.js']
        ]
    ];
}

/**
 * Charge les ressources CSS et JS d'un thème spécifique
 * 
 * @param string $themeId Identifiant du thème à charger
 * @return string Code HTML à insérer dans l'en-tête du document
 */
function chargerTheme($themeId = null) {
    // Récupérer tous les thèmes disponibles
    $themes = getThemes();
    
    // Si aucun thème n'est spécifié ou si le thème n'existe pas, utiliser le thème par défaut
    if ($themeId === null || !isset($themes[$themeId])) {
        // Vérifier si un thème est enregistré dans les cookies
        if (isset($_COOKIE['theme']) && isset($themes[$_COOKIE['theme']])) {
            $themeId = $_COOKIE['theme'];
        } else {
            $themeId = 'default';
        }
    }
    
    // Vérifier si le thème existe
    if (!isset($themes[$themeId])) {
        $themeId = 'default';
    }
    
    // Enregistrer le thème dans un cookie (valable 30 jours)
    setcookie('theme', $themeId, time() + (86400 * 30), '/');
    
    // Générer les balises HTML pour les fichiers CSS
    $output = "<!-- Chargement du thème: {$themes[$themeId]['nom']} -->\n";
    
    // Charger les fichiers CSS
    if (isset($themes[$themeId]['css'])) {
        // S'assurer que css est un tableau
        $cssFiles = is_array($themes[$themeId]['css']) ? $themes[$themeId]['css'] : [$themes[$themeId]['css']];
        
        foreach ($cssFiles as $css) {
            $timestamp = filemtime($_SERVER['DOCUMENT_ROOT'] . '/' . $css);
            $output .= "<link rel='stylesheet' href='{$css}?v={$timestamp}'>\n";
        }
    }
    
    // Charger les fichiers JavaScript
    if (isset($themes[$themeId]['js'])) {
        // S'assurer que js est un tableau
        $jsFiles = is_array($themes[$themeId]['js']) ? $themes[$themeId]['js'] : [$themes[$themeId]['js']];
        
        foreach ($jsFiles as $js) {
            $timestamp = filemtime($_SERVER['DOCUMENT_ROOT'] . '/' . $js);
            $output .= "<script src='{$js}?v={$timestamp}' defer></script>\n";
        }
    }
    
    return $output;
}
?>