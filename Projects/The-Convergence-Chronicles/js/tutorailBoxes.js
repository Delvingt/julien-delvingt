// ch1l1.js - Complete tutorial system with HTML-defined positioning

// HTML-Defined Tutorial Positioning System
const HTMLTutorialPositioning = {
  
  // Initialize all tutorial boxes based on their HTML data attributes
  initializeFromHTML() {
    const tutorialBoxes = document.querySelectorAll('.tutorial-box[data-position]');
    
    tutorialBoxes.forEach(box => {
      this.positionFromDataAttributes(box);
      // Also make it draggable
      makeTutorialDraggable(box);
    });
  },
  
  // Handle offset positioning (custom x,y offset from target element)
  handleOffsetPositioning(tutorialBox) {
    const target = tutorialBox.dataset.positionTarget;
    const offsetX = parseInt(tutorialBox.dataset.positionX) || 0;
    const offsetY = parseInt(tutorialBox.dataset.positionY) || 0;
    
    if (!target) {
      console.warn('Offset positioning requires data-position-target');
      return this.handleDefaultPositioning(tutorialBox);
    }
    
    const targetElement = document.querySelector(target);
    if (!targetElement) {
      console.warn(`Target element '${target}' not found`);
      return this.handleDefaultPositioning(tutorialBox);
    }
    
    const targetRect = targetElement.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    
    // Position relative to target's top-left corner with custom offset
    const x = targetRect.left + scrollX + offsetX;
    const y = targetRect.top + scrollY + offsetY;
    
    this.setPosition(tutorialBox, x, y);
  },
  
  // Handle dynamic positioning (set via JavaScript)
  handleDynamicPositioning(tutorialBox) {
    // Dynamic positioning is handled by external JavaScript
    // This method exists for completeness but positioning should be done via setPosition()
    console.log(`Dynamic positioning for ${tutorialBox.id} - use HTMLTutorialPositioning.setPosition() to position manually`);
  },
  
  // Handle center positioning
  handleCenterPositioning(tutorialBox) {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY
    };
    
    const x = viewport.scrollX + (viewport.width - tutorialBox.offsetWidth) / 2;
    const y = viewport.scrollY + (viewport.height - tutorialBox.offsetHeight) / 2;
    
    this.setPosition(tutorialBox, x, y);
  },
  
  // Handle smart positioning (avoids edges)
  handleSmartPositioning(tutorialBox) {
    const preferredX = parseInt(tutorialBox.dataset.positionX) || 100;
    const preferredY = parseInt(tutorialBox.dataset.positionY) || 100;
    const padding = parseInt(tutorialBox.dataset.positionPadding) || 20;
    
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY
    };
    
    let x = preferredX + viewport.scrollX;
    let y = preferredY + viewport.scrollY;
    
    // Adjust if too close to edges
    if (x + tutorialBox.offsetWidth + padding > viewport.scrollX + viewport.width) {
      x = viewport.scrollX + viewport.width - tutorialBox.offsetWidth - padding;
    }
    if (x < viewport.scrollX + padding) {
      x = viewport.scrollX + padding;
    }
    if (y + tutorialBox.offsetHeight + padding > viewport.scrollY + viewport.height) {
      y = viewport.scrollY + viewport.height - tutorialBox.offsetHeight - padding;
    }
    if (y < viewport.scrollY + padding) {
      y = viewport.scrollY + padding;
    }
    
    this.setPosition(tutorialBox, x, y);
  },
  
  // Handle responsive positioning
  handleResponsivePositioning(tutorialBox) {
    const screenWidth = window.innerWidth;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    
    let x, y;
    
    if (screenWidth >= 1200) {
      x = parseInt(tutorialBox.dataset.positionDesktopX) || parseInt(tutorialBox.dataset.positionX) || 100;
      y = parseInt(tutorialBox.dataset.positionDesktopY) || parseInt(tutorialBox.dataset.positionY) || 100;
    } else if (screenWidth >= 768) {
      x = parseInt(tutorialBox.dataset.positionTabletX) || parseInt(tutorialBox.dataset.positionX) || 50;
      y = parseInt(tutorialBox.dataset.positionTabletY) || parseInt(tutorialBox.dataset.positionY) || 50;
    } else {
      x = parseInt(tutorialBox.dataset.positionMobileX) || parseInt(tutorialBox.dataset.positionX) || 20;
      y = parseInt(tutorialBox.dataset.positionMobileY) || parseInt(tutorialBox.dataset.positionY) || 20;
    }
    
    this.setPosition(tutorialBox, x + scrollX, y + scrollY);
  },
  
  // Handle viewport-relative positioning (percentages)
  handleViewportPositioning(tutorialBox) {
    const xPercent = parseFloat(tutorialBox.dataset.positionX) || 50;
    const yPercent = parseFloat(tutorialBox.dataset.positionY) || 50;
    
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY
    };
    
    const x = viewport.scrollX + (viewport.width * xPercent / 100) - (tutorialBox.offsetWidth / 2);
    const y = viewport.scrollY + (viewport.height * yPercent / 100) - (tutorialBox.offsetHeight / 2);
    
    this.setPosition(tutorialBox, x, y);
  },
  
  // Default positioning fallback
  handleDefaultPositioning(tutorialBox) {
    const index = Array.from(document.querySelectorAll('.tutorial-box')).indexOf(tutorialBox);
    const x = 50 + window.scrollX + (index * 20);
    const y = 100 + window.scrollY + (index * 20);
    
    this.setPosition(tutorialBox, x, y);
  },
  
  // Handle offset positioning (custom x,y offset from target element)
  handleOffsetPositioning(tutorialBox) {
    const target = tutorialBox.dataset.positionTarget;
    const offsetX = parseInt(tutorialBox.dataset.positionX) || 0;
    const offsetY = parseInt(tutorialBox.dataset.positionY) || 0;
    
    if (!target) {
      console.warn('Offset positioning requires data-position-target');
      return this.handleDefaultPositioning(tutorialBox);
    }
    
    const targetElement = document.querySelector(target);
    if (!targetElement) {
      console.warn(`Target element '${target}' not found`);
      return this.handleDefaultPositioning(tutorialBox);
    }
    
    const targetRect = targetElement.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    
    // Position relative to target's top-left corner with custom offset
    const x = targetRect.left + scrollX + offsetX;
    const y = targetRect.top + scrollY + offsetY;
    
    this.setPosition(tutorialBox, x, y);
  },
  
  // Handle dynamic positioning (set via JavaScript)
  handleDynamicPositioning(tutorialBox) {
    // Dynamic positioning is handled by external JavaScript
    // This method exists for completeness but positioning should be done via setPosition()
    console.log(`Dynamic positioning for ${tutorialBox.id} - use HTMLTutorialPositioning.setPosition() to position manually`);
  },
  

  // Position a single tutorial box based on its data attributes
  positionFromDataAttributes(tutorialBox) {
    const positionType = tutorialBox.dataset.position;
    
    switch (positionType) {
      case 'relative':
        this.handleRelativePositioning(tutorialBox);
        break;
      case 'absolute':
        this.handleAbsolutePositioning(tutorialBox);
        break;
      case 'center':
        this.handleCenterPositioning(tutorialBox);
        break;
    }
  },
  
  // Handle relative positioning (relative to another element)
  handleRelativePositioning(tutorialBox) {
    const target = tutorialBox.dataset.positionTarget;
    const side = tutorialBox.dataset.positionSide || 'right';
    
    // Support both old single offset and new separate x/y offsets
    const legacyOffset = parseInt(tutorialBox.dataset.positionOffset) || 0;
    const offsetX = parseInt(tutorialBox.dataset.positionOffsetX) || legacyOffset || 20;
    const offsetY = parseInt(tutorialBox.dataset.positionOffsetY) || legacyOffset || 20;
    
    // Additional manual offsets (can be negative)
    const manualOffsetX = parseInt(tutorialBox.dataset.positionManualX) || 0;
    const manualOffsetY = parseInt(tutorialBox.dataset.positionManualY) || 0;
    
    if (!target) {
      console.warn('Relative positioning requires data-position-target');
      return this.handleDefaultPositioning(tutorialBox);
    }
    
    const targetElement = document.querySelector(target);
    if (!targetElement) {
      console.warn(`Target element '${target}' not found`);
      return this.handleDefaultPositioning(tutorialBox);
    }
    
    const targetRect = targetElement.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    
    let x, y;
    
    switch (side) {
      case 'right':
        x = targetRect.right + scrollX + offsetX;
        y = targetRect.top + scrollY + offsetY;
        break;
      case 'left':
        x = targetRect.left + scrollX - tutorialBox.offsetWidth - offsetX;
        y = targetRect.top + scrollY + offsetY;
        break;
      case 'top':
        x = targetRect.left + scrollX + offsetX;
        y = targetRect.top + scrollY - tutorialBox.offsetHeight - offsetY;
        break;
      case 'bottom':
        x = targetRect.left + scrollX + offsetX;
        y = targetRect.bottom + scrollY + offsetY;
        break;
      case 'center':
        x = targetRect.left + scrollX + (targetRect.width - tutorialBox.offsetWidth) / 2 + offsetX;
        y = targetRect.top + scrollY + (targetRect.height - tutorialBox.offsetHeight) / 2 + offsetY;
        break;
      case 'custom':
        // For completely custom positioning relative to target
        x = targetRect.left + scrollX + offsetX;
        y = targetRect.top + scrollY + offsetY;
        break;
    }
    
    // Apply additional manual offsets
    x += manualOffsetX;
    y += manualOffsetY;
    
    this.setPosition(tutorialBox, x, y);
  },
  
  // Handle absolute positioning with specific coordinates
  handleAbsolutePositioning(tutorialBox) {
    const x = parseInt(tutorialBox.dataset.positionX) || 0;
    const y = parseInt(tutorialBox.dataset.positionY) || 0;
    
    // Support additional offsets
    const offsetX = parseInt(tutorialBox.dataset.positionOffsetX) || 0;
    const offsetY = parseInt(tutorialBox.dataset.positionOffsetY) || 0;
    
    this.setPosition(tutorialBox, x + offsetX + window.scrollX, y + offsetY + window.scrollY);
  },
  
  // Handle center positioning
  handleCenterPositioning(tutorialBox) {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY
    };
    
    const x = viewport.scrollX + (viewport.width - tutorialBox.offsetWidth) / 2;
    const y = viewport.scrollY + (viewport.height - tutorialBox.offsetHeight) / 2;
    
    this.setPosition(tutorialBox, x, y);
  },
  
  // Utility function to set position
  setPosition(element, x, y) {
    element.style.left = x + 'px';
    element.style.top = y + 'px';
  },
  
  // Reposition all tutorials (useful for window resize)
  repositionAll() {
    const tutorialBoxes = document.querySelectorAll('.tutorial-box[data-position]:not(.hide)');
    tutorialBoxes.forEach(box => {
      this.positionFromDataAttributes(box);
    });
  }
};

// Draggable Tutorial Box Implementation
let isDragging = false;
let currentDragElement = null;
let dragOffset = { x: 0, y: 0 };

// Make a specific tutorial box draggable
function makeTutorialDraggable(element) {
  const header = element.querySelector('.tutorial-header');
  if (header) {
    header.style.cursor = 'move';
    header.addEventListener('mousedown', startDrag);
  }
}

// Start dragging
function startDrag(e) {
  e.preventDefault();
  
  currentDragElement = e.target.closest('.tutorial-box');
  if (!currentDragElement) return;
  
  isDragging = true;
  
  const rect = currentDragElement.getBoundingClientRect();
  dragOffset.x = e.clientX - rect.left;
  dragOffset.y = e.clientY - rect.top;
  
  currentDragElement.classList.add('dragging');
  
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
  
  document.body.style.userSelect = 'none';
}

// Handle dragging
function drag(e) {
  if (!isDragging || !currentDragElement) return;
  
  e.preventDefault();
  
  // Calculate new position relative to the document (accounting for scroll)
  let newX = e.clientX + window.scrollX - dragOffset.x;
  let newY = e.clientY + window.scrollY - dragOffset.y;
  
  // Optional: Constrain to document bounds
  const documentBounds = {
    width: Math.max(document.documentElement.scrollWidth, window.innerWidth),
    height: Math.max(document.documentElement.scrollHeight, window.innerHeight)
  };
  
  const elementRect = currentDragElement.getBoundingClientRect();
  
  // Keep element within document bounds
  newX = Math.max(0, Math.min(newX, documentBounds.width - elementRect.width));
  newY = Math.max(0, Math.min(newY, documentBounds.height - elementRect.height));
  
  // Update position
  currentDragElement.style.left = newX + 'px';
  currentDragElement.style.top = newY + 'px';
}

// Stop dragging
function stopDrag(e) {
  if (!isDragging) return;
  
  isDragging = false;
  
  if (currentDragElement) {
    currentDragElement.classList.remove('dragging');
  }
  
  currentDragElement = null;
  
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', stopDrag);
  
  document.body.style.userSelect = '';
}

// Close specific tutorial box
function closeTutorialBox(tutorialId) {
  const tutorialBox = document.getElementById(tutorialId);
  
  if (tutorialBox) {
    tutorialBox.classList.add('hide');
    console.log(`Closed tutorial: ${tutorialId}`);
  } else {
    console.warn(`Tutorial box with ID '${tutorialId}' not found`);
  }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    HTMLTutorialPositioning.initializeFromHTML();
  }, 100);
});

// Reposition on window resize
window.addEventListener('resize', debounce(() => {
  HTMLTutorialPositioning.repositionAll();
}, 250));

// Utility: Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Your existing level-specific code can go here
console.log('Chapter 1 Level 1 - Tutorial system initialized');