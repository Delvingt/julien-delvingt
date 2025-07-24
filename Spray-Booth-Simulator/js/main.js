///////////////
// instances //
///////////////
let simulator;

//////////////////////
// DOMContentLoaded //
//////////////////////
// Initialize simulator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create simulator instance
    const simulator = new Simulator();
    
    // Hide optional form initially
    document.getElementById('optionalForm').style.display = 'none';
    
    // Set some default values for testing
    document.getElementById('Ls').value = 2;
    document.getElementById('ds').value = 10;
    document.getElementById('Vs').value = 10;
    document.getElementById('N').value = 4;
    document.getElementById('x').value = 0;
    
    console.log('Paint Sprayer Simulator initialized');
});