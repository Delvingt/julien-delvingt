<?php
/**
 * Fonctions utilitaires pour le portail multimédia (version lecture seule)
 */

 /**
 * Récupère l'adresse IP du client
 * 
 * @return string Adresse IP du client
 */
function getClientIP() {
    // Vérifier si on est derrière un proxy
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        // HTTP_X_FORWARDED_FOR peut contenir plusieurs IPs séparées par des virgules
        $ipList = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($ipList[0]); // Prendre la première IP (celle de l'utilisateur)
    } else {
        return $_SERVER['REMOTE_ADDR'];
    }
}

/**
 * Vérifie si une adresse IP est dans la liste des adresses IP de confiance
 * 
 * @param string|array $allowedIPs Adresse IP unique ou tableau d'adresses IP autorisées
 * @param string|null $clientIP Adresse IP à vérifier (si null, utilise getClientIP())
 * @return bool Retourne true si l'IP est autorisée, false sinon
 */
function ClientIsTrusted($parameters, $clientIP) {   
    $trustedIPs = $parameters['trusted_ips'];
    // Convertir $allowedIPs en tableau s'il s'agit d'une chaîne
    if (!is_array($trustedIPs)) {
        $trustedIPs = [$trustedIPs];
    }
    
    // Vérifier chaque IP autorisée
    foreach ($trustedIPs as $ip) {
        if ($ip === $clientIP) {
            return true;
        }
    }

    return false;
}

/**
 * Détermine si le client est connecté au réseau NAS
 * 
 * @param array $parameters Tableau des paramètres du site web
 * @return string|bool 'NAS' si connecté au réseau NAS, 'local' si connecté au réseau local, false sinon
 */
function isClientOnNASNetwork($parameters,$clientIP) {
    $NASnetwork = $parameters['NASnetwork'];
    // Vérifier si l'IP commence par le préfixe du réseau NAS
    if (strpos($clientIP, $NASnetwork) === 0) {
        return true;
    }

    return false;
}

/**
 * Génère le HTML pour une carte de service
 * 
 * @param array $service Informations du service
 * @return string HTML de la carte
 */
function renderServiceCard($service) {    
    return <<<HTML
    <div class="service-card" data-id="{$service['id']}">
        <div class="card-image" style="background-image: url({$service['image']});">
        </div>
        <div class="card-content">
            <h2 class="card-title">{$service['title']}</h2>
            <p class="card-description">{$service['description']}</p>
            <a href="{$service['url']}" target="_blank" class="card-link">Accéder</a>
        </div>
    </div>
HTML;
}