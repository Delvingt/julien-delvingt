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