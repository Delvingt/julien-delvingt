<!-- Prevent focus on Iframe when Loading -->
function noscroll() {
    window.scrollTo(0, 0);
}
// add listener to disable scroll
window.addEventListener('scroll', noscroll);
function onMyFrameLoad() {
    setTimeout(function () {
        // Remove the scroll disabling listener (to enable scrolling again)
        window.removeEventListener('scroll', noscroll);
    }, 100);
}

