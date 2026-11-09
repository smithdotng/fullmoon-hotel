// Page script carried over from views/about.ejs
/*--- script 0 ---*/

        $(document).ready(function() {
            // Initialize gallery carousel
            $('.owl-slider-gallery').owlCarousel({
                items: 1,
                loop: true,
                nav: true,
                dots: true,
                autoplay: true,
                autoplayTimeout: 5000,
                autoplayHoverPause: true,
                navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"]
            });
        });
