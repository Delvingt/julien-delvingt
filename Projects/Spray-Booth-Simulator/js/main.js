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
    
    // Set some default values for testing
    document.getElementById('Ls').value = 2;
    document.getElementById('ds').value = 10;
    document.getElementById('spm').value = 22;
    document.getElementById('Vc').value = 10;
    document.getElementById('N').value = 5;
    document.getElementById('x').value = 0;
    
    console.log('Paint Sprayer Simulator initialized');
});