<?php
// Inclure les fichiers nécessaires
require_once 'php/config.php';

// Démarrer la session
session_start();

// Identifie l'adresse IP du client
$clientIP = getClientIP();

// Vérifier si le client est dans les IP's de confiance
$ClientIsTrusted = ClientIsTrusted($parameters, $clientIP);

// Identifie si le client est sur le réseau NAS
$isClientOnNASNetwork = isClientOnNASNetwork($parameters, $clientIP);

//Génere le vecteur des Services
$allServices = Services($isClientOnNASNetwork, $parameters);

// Vérifier si l'utilisateur est authentifié par mot de passe
$isAuthenticated = false;
if (isset($_SESSION['authenticated']) && $_SESSION['authenticated'] === true) {
    $isAuthenticated = true;
}

// Vérifier l'authentification par mot de passe si un formulaire a été soumis
if (isset($_POST['password']) && !empty($_POST['password'])) {
    if ($_POST['password'] === $parameters['password']) {
        $_SESSION['authenticated'] = true;
        $isAuthenticated = true;
        // Rediriger pour éviter la résoumission du formulaire
        header('Location: ' . $_SERVER['PHP_SELF']);
        exit;
    } else {
        $passwordError = "Mot de passe incorrect";
    }
}

// Traiter la déconnexion
if (isset($_GET['logout'])) {
    unset($_SESSION['authenticated']);
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit;
}

// Accès à la section configuration autorisé si IP de confiance OU authentifié par mot de passe
$hasConfigAccess = $ClientIsTrusted || $isAuthenticated;

// Filtrer les services par catégorie
$mediaServices = array_filter($allServices, function($service) {
    return $service['category'] === 'media';
});

$configServices = array_filter($allServices, function($service) {
    return $service['category'] === 'config';
});

// Récupérer la liste des thèmes pour votre modal
$themes = getThemes();
$themeActuel = isset($_COOKIE['theme']) ? $_COOKIE['theme'] : 'default';

?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="favicon.ico">
    <title>Portail Multimédia</title>
    <!-- Style libraries -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    <!-- Styles -->
    <link rel="stylesheet" href="css/styles.css">
    <!-- Chargement du thème sélectionné -->
    <?php echo chargerTheme($themeActuel); ?>
</head>
<body class="<?php echo $darkModeClass; ?>">
    <!-- Navbar -->
    <nav class="navbar">
        <a href="#" class="navbar-brand">
            <i class="fas fa-film"></i> Portail Multimédia
        </a>
        <div class="navbar-tools">
            <?php if (!$ClientIsTrusted): ?>
                <?php if ($isAuthenticated): ?>
                    <button id="LogoutBtn" class="navbar-config-btn authenticated" data-tooltip="Se Déconnecter">
                        <i class="fas fa-unlock"></i>
                    </button>
                <?php else: ?>
                    <button id="LoginBtn" class="navbar-config-btn" data-tooltip="Se Connecter">
                        <i class="fas fa-lock"></i>
                    </button>
                <?php endif; ?>
            <?php endif; ?>
            <button id="ThemeOptionsBtn" class="navbar-config-btn" data-tooltip="Options de Thème">
                <i class="fas fa-brush"></i>
            </button>
        </div>
    </nav>

    <!-- Section Multimédia -->
    <div class="section-header">
        <h2 class="section-title">
            <i class="fas fa-play-circle"></i> Multimédia
        </h2>
        <div class="view-toggle">
            <button class="view-btn active" data-view="grid">
                <i class="fas fa-th"></i>
            </button>
            <button class="view-btn" data-view="list">
                <i class="fas fa-list"></i>
            </button>
        </div>
    </div>

    <div class="services-container" id="mediaContainer">
        <?php foreach ($mediaServices as $service): ?>
            <?php echo renderServiceCard($service); ?>
        <?php endforeach; ?>
    </div>

    <!-- Section Configuration -->
    <?php if ($hasConfigAccess): ?>
    <div class="section-header">
        <h2 class="section-title">
            <i class="fas fa-cogs"></i> Configuration
        </h2>
        <div class="view-toggle">
            <button class="view-btn active" data-view="grid">
                <i class="fas fa-th"></i>
            </button>
            <button class="view-btn" data-view="list">
                <i class="fas fa-list"></i>
            </button>
        </div>
    </div>
    <div class="services-container" id="configContainer">
        <?php foreach ($configServices as $service): ?>
            <?php echo renderServiceCard($service); ?>
        <?php endforeach; ?>
    </div>
    <?php endif; ?>

    <!-- Modal de connexion -->
    <div id="loginModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-key"></i> Authentification</h3>
                <span class="close-btn">&times;</span>
            </div>
            <form class="modal-form" method="post" action="">
                <?php if (isset($passwordError)): ?>
                <div class="error-message"><?php echo $passwordError; ?></div>
                <input type="hidden" id="showModalOnError" value="1">
                <?php endif; ?>
                <input type="password" name="password" placeholder="Entrez le mot de passe" required>
                <button type="submit">Se connecter</button>
            </form>
        </div>
    </div>

    <!-- Modal de sélection de thème -->
    <div id="theme-selector-modal" class="theme-modal">
        <div class="theme-modal-content">
            <div class="theme-modal-header">
                <h2>Sélectionner un thème</h2>
                <span class="theme-modal-close">&times;</span>
            </div>
            <div class="theme-modal-body">
                <?php foreach ($themes as $id => $theme): ?>
                    <?php $selectedClass = ($id === $themeActuel) ? 'theme-selected' : ''; ?>
                    <div class="theme-item <?php echo $selectedClass; ?>" data-theme-id="<?php echo $id; ?>">
                        <div class="theme-info">
                            <h3><?php echo $theme['nom']; ?></h3>
                        </div>    
                        <div class="theme-preview">
                            <img src="<?php echo $theme['preview']; ?>" alt="Aperçu du thème <?php echo $theme['nom']; ?>">
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
            <div class="theme-modal-footer">
                <button id="theme-selector-save">Appliquer le thème</button>
            </div>
        </div>
    </div>

    <!-- Container de Notifications -->
    <div class="toast-container" id="toastContainer"></div>

    <!-- Main Scripts -->
    <script src="js/main.js"></script>
</body>
</html>