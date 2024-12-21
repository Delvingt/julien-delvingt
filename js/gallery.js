/* https://workik.com/best-gallery-designs-for-websites-with-html-css-and-javascript */

$(document).ready(function() {

    $(`[unique-script-id="w-w-dm-id"] .smallImage`).click(function() {
        $(this).parent().children(".overlay").show();

    });

    $(`[unique-script-id="w-w-dm-id"] .btn-box`).click(function() {
        $(this).parent().children(".overlay").show();

    });


    $(`[unique-script-id="w-w-dm-id"] .close`).click(function() {
        $(".overlay").hide();
    });

    $(`[unique-script-id="w-w-dm-id"] .overlay`).click(function() {
        $(".overlay").hide();
    });
});