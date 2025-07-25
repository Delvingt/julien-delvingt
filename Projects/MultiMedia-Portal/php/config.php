<?php
/**
 * Configuration des services du portail multimédia
 */
require_once 'php/functions.php';
require_once 'themes/theme-manager.php';

// Paramètres du site web
$parameters = [
    'trusted_ips'   => ['10.0.1.3'],
    'password'      => '5656',
    'NASnetwork'    => '10.0.1',
    'LocalNetwork'  => '192.168.0',
    'NASsubnet'     => '2'
];


function Services($isClientOnNASNetwork, $parameters){

    // Determine le réseau
    if($isClientOnNASNetwork){
        $NASip = $parameters['NASnetwork'].'.'.$parameters['NASsubnet'];
    }else{
        $NASip = $parameters['LocalNetwork'].'.'.$parameters['NASsubnet'];
    }

    // Services multimédia
    $mediaServices = [
        [
            'id' => 'youtube',
            'title' => 'YouTube',
            'description' => 'Plateforme de vidéos en ligne avec des millions de contenus.',
            'image' => 'images/youtube.png',
            'url' => 'https://www.youtube.com',
            'category' => 'media'
        ],
        [
            'id' => 'plex',
            'title' => 'Plex',
            'description' => 'Votre médiathèque personnelle pour films, séries et musique.',
            'image' => 'images/plex.jpg',
            'url' => 'http://'.$NASip.':32400/web/index.html',
            'category' => 'media'
        ],
        [
            'id' => 'RMCBFMPlay',
            'title' => 'RMC BFM Play',
            'description' => 'Regardez en replay RMC Découverte, RMC Story, BFMTV, BFM Business, BFM Régions, Tech and Co',
            'image' => 'images/RMCBFMPlay.jpg',
            'url' => 'https://www.rmcbfmplay.com/',
            'category' => 'media'
        ],
        [
            'id' => 'auvio',
            'title' => 'Auvio',
            'description' => 'Toute l\'offre audio, vidéo et direct de la RTBF',
            'image' => 'images/auvio.jpg',
            'url' => 'https://auvio.rtbf.be/',
            'category' => 'media'
        ],
        [
            'id' => 'rtlplay',
            'title' => 'RTL Play',
            'description' => 'Revoir les programmes RTL play en replay ou en direct: rediffusion gratuite en streaming',
            'image' => 'images/rtlplay.jpg',
            'url' => 'https://www.rtlplay.be',
            'category' => 'media'
        ],
        [
            'id' => 'francetv',
            'title' => 'France.tv',
            'description' => 'Plateforme officielle de France Télévisions, proposant le direct et le replay de leurs programmes.',
            'image' => 'images/francetv.jpg',
            'url' => 'https://www.france.tv',
            'category' => 'media'
        ],
        [
            'id' => 'arte',
            'title' => 'ARTE.tv',
            'description' => 'Plateforme culturelle d\'ARTE offrant documentaires, films, séries et concerts, sans publicité.',
            'image' => 'images/arte.jpg',
            'url' => 'https://www.arte.tv',
            'category' => 'media'
        ],
        [
            'id' => 'tf1plus',
            'title' => 'TF1+',
            'description' => 'Portail gratuit du groupe TF1 pour le direct et le replay des chaînes TF1, TMC, TFX et plus, avec inscription gratuite.',
            'image' => 'images/tf1.jpg',
            'url' => 'https://www.tf1.fr',
            'category' => 'media'
        ],
        [
            'id' => 'm6plus',
            'title' => 'M6+',
            'description' => 'Service de streaming du groupe M6 offrant le direct et le replay de ses chaînes, financé par la publicité, avec compte gratuit.',
            'image' => 'images/m6.png',
            'url' => 'https://www.m6.fr',
            'category' => 'media'
        ],
        [
            'id' => 'tv5mondeplus',
            'title' => 'TV5MONDEplus',
            'description' => 'Plateforme internationale de TV5MONDE dédiée aux contenus francophones en streaming gratuit.',
            'image' => 'images/tv5monde.jpg',
            'url' => 'https://www.tv5mondeplus.com',
            'category' => 'media'
        ],
        [
            'id' => 'molotov',
            'title' => 'Molotov TV',
            'description' => 'Plateforme d\'agrégation de chaînes TV en direct et en replay, accessible avec un compte gratuit.',
            'image' => 'images/molotov.jpg',
            'url' => 'https://www.molotov.tv',
            'category' => 'media'
        ],
        [
            'id' => 'plutotv',
            'title' => 'Pluto TV',
            'description' => 'Plateforme internationale offrant des chaînes TV thématiques et un catalogue de films/séries, sans inscription requise.',
            'image' => 'images/plutotv.jpg',
            'url' => 'https://pluto.tv',
            'category' => 'media'
        ],
        [
            'id' => 'rakutentv',
            'title' => 'Rakuten TV (Free)',
            'description' => 'Section gratuite de Rakuten TV avec films et séries récents financés par la publicité, sans abonnement.',
            'image' => 'images/rakuten.jpg',
            'url' => 'https://rakuten.tv',
            'category' => 'media'
        ],
        [
            'id' => 'crunchyroll',
            'title' => 'Crunchyroll (Free)',
            'description' => 'Service de streaming d\'anime proposant une formule gratuite avec publicité pour un catalogue partiel d’épisodes en VOSTFR.',
            'image' => 'images/crunchyroll.png',
            'url' => 'https://www.crunchyroll.com',
            'category' => 'media'
        ],
        [
            'id' => 'filmzie',
            'title' => 'Filmzie',
            'description' => 'Plateforme internationale de films indépendants et classiques, gratuite et financée par la publicité.',
            'image' => 'images/filmzie.jpg',
            'url' => 'https://filmzie.com',
            'category' => 'media'
        ]
    ];

    // Services de configuration
    $configServices = [
        [
            'id' => 'dsm',
            'title' => 'DSM',
            'description' => 'Interface de gestion pour votre NAS Synology.',
            'image' => 'images/dsm.png',
            'url' => 'https://'.$NASip.':5001/',
            'category' => 'config'
        ],
        [
            'id' => 'activeinsight',
            'title' => 'Active Insight',
            'description' => 'Moniteur de votre NAS Synology.',
            'image' => 'images/ActiveInsight.jpg',
            'url' => 'https://insight.synology.com/en-us/servers',
            'category' => 'config'
        ],
        [
            'id' => 'homeassistant',
            'title' => 'Home Assistant',
            'description' => 'Home Automation.',
            'image' => 'images/homeassistant.png',
            'url' => 'http://'.$NASip.':8123/',
            'category' => 'config'
        ],  
        [
            'id' => 'radarr',
            'title' => 'Radarr',
            'description' => 'Gestionnaire de téléchargement pour vos films.',
            'image' => 'images/radarr.png',
            'url' => 'http://'.$NASip.':7878/',
            'category' => 'config'
        ],
        [
            'id' => 'sonarr',
            'title' => 'Sonarr',
            'description' => 'Gestionnaire de téléchargement pour vos séries TV.',
            'image' => 'images/sonarr.png',
            'url' => 'http://'.$NASip.':8989/',
            'category' => 'config'
        ],
        [
            'id' => 'bazarr',
            'title' => 'Bazarr',
            'description' => 'Gestionnaire de sous-titres pour vos médias.',
            'image' => 'images/bazarr.png',
            'url' => 'http://'.$NASip.':6767/',
            'category' => 'config'
        ],
        [
            'id' => 'prowlarr',
            'title' => 'Prowlarr',
            'description' => 'Gestionnaire de tracker.',
            'image' => 'images/prowlarr.png',
            'url' => 'http://'.$NASip.':9696/',
            'category' => 'config'
        ],
        [
            'id' => 'phpmyadmin',
            'title' => 'PHP My Admin',
            'description' => 'Gestionnaire de base de données.',
            'image' => 'images/phpmyadmin.png',
            'url' => 'http://'.$NASip.'/phpmyadmin/',
            'category' => 'config'
        ]
    ];
    // Fusionner tous les services
    $allServices = array_merge($mediaServices, $configServices);

    return $allServices;
}



