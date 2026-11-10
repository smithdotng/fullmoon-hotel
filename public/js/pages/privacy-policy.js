// Page script carried over from views/privacy-policy.ejs
/*--- script 0 ---*/

        // Smooth scrolling for anchor links
        $(document).ready(function() {
            $('a[href^="#"]').on('click', function(event) {
                if (this.hash !== "") {
                    event.preventDefault();
                    var hash = this.hash;
                    $('html, body').animate({
                        scrollTop: $(hash).offset().top - 100
                    }, 800);
                }
            });

            // Highlight current section when scrolling
            $(window).on('scroll', function() {
                var scrollPos = $(document).scrollTop() + 100;
                $('.policy-section').each(function() {
                    var sectionTop = $(this).offset().top;
                    var sectionBottom = sectionTop + $(this).outerHeight();
                    if (scrollPos >= sectionTop && scrollPos <= sectionBottom) {
                        $(this).css('background-color', '#f8f9fa');
                        $(this).css('padding', '20px');
                        $(this).css('border-radius', '10px');
                        $(this).css('transition', 'all 0.3s ease');
                    } else {
                        $(this).css('background-color', '');
                        $(this).css('padding', '');
                        $(this).css('border-radius', '');
                    }
                });
            });
        });
