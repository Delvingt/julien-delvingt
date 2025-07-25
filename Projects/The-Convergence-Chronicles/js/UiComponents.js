/////////////////////
// Background Orbs //
/////////////////////
function renderOrbs(){
    const HTML = `
    <div class="floating-orb orb-1"></div>
    <div class="floating-orb orb-2"></div>
    <div class="floating-orb orb-3"></div>
    <div class="floating-orb orb-4"></div>
    `;

    return HTML.trim();
}

//////////////
// Menu Bar //
//////////////
function renderMenuBar(options) {
    // Destructure options with defaults
    const {
        title = 'Menu',
        exitText = 'Exit',
        exitLink = '#',
        backText = 'Previous Level',
        backLink = '#',
        nextText = 'Next Level',
        nextLink = '#'
    } = options;

    let navBackHTML = ``;
    let navNextHTML = ``;

    if(backText !==''){
        navBackHTML = `
        <a href="${backLink}" class="menu-button">
            <i class="fas fa-arrow-left"></i>
            <span>${backText}</span>
        </a>
        `;
    }
    if(nextText !==''){
        navNextHTML = `
        </a>
            <a href="${nextLink}" class="menu-button">
            <i class="fas fa-arrow-right"></i>
            <span>${nextText}</span>
        </a>
        `;
    }

  // Create the HTML string
  const HTML = `
    <div class="menubar-container">
    <!-- Exit Button -->
    <a href="${exitLink}" class="menu-button">
        <i class="fa-solid fa-arrow-right-from-bracket"></i>
        <span>${exitText}</span>
    </a>

    <!-- Game Title -->
    <h1 class="menu-title">${title}</h1>
    
    <!-- Nav Buttons -->
    <div class="nav-buttons">
        ${navBackHTML}
        ${navNextHTML}
    </div>

    </div>
    `;

  return HTML.trim();
}