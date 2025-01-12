
(function ($) {
    "use strict";

    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 500) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').on("click", function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Header carousel
    $(document).ready(function() {

        $("#header_carousel").owlCarousel({
            autoplay:true,
            autoPlay: 2000, //Set AutoPlay to 3 seconds
            dots: true,
            loop: true,

            items : 1,
            itemsDesktop : [1199,3],
            itemsDesktopSmall : [979,3]

        });

    });


    // Gallery Index carousel
    $(document).ready(function() {

        $("#gallery_index_carousel").owlCarousel({
            autoPlay: 3000, //Set AutoPlay to 3 seconds
            items : 4,
            nav : true,
            dots: true,
            loop: true,
            itemsDesktop : [1199,4],
            itemsDesktopSmall : [979,2],
            itemsTablet: [700, 1],
            itemsMobile: [500, 1],
            navText : [
                '<i class="bi bi-arrow-left"></i>',
                '<i class="bi bi-arrow-right"></i>'
            ]
        });

    });

    // Reviews Index carousel
    $(".reviews_carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            }
        }
    });

})(jQuery);

