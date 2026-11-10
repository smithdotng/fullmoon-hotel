// Page script carried over from views/contact.ejs
/*--- script 0 ---*/

    $(document).ready(function() {
        // Contact form toggle - prevent default behavior
        $('.open-form').on('click', function(e) {
            e.preventDefault();
            var $form = $('#contactForm');
            var $button = $(this);
            
            if ($form.hasClass('active')) {
                $form.removeClass('active').slideUp(300);
                $button.text($button.data('text-open') || 'Contact us via form');
            } else {
                $form.addClass('active').slideDown(300);
                $button.text($button.data('text-close') || 'Close form');
            }
        });

        // Initialize form as hidden
        $('#contactForm').hide();

        // Form validation - prevent submission if validation fails
        $('#contactForm form').on('submit', function(e) {
            var $form = $(this);
            var required = $form.find('[required]');
            var valid = true;

            // Reset error states
            $form.find('.form-control').removeClass('error');
            
            // Check required fields
            required.each(function() {
                if (!$(this).val().trim()) {
                    valid = false;
                    $(this).addClass('error');
                    // Add bootstrap error class
                    $(this).closest('.form-group').addClass('has-error');
                } else {
                    $(this).closest('.form-group').removeClass('has-error');
                }
            });

            if (!valid) {
                e.preventDefault();
                // Show error message near the form
                if (!$('.form-error-message').length) {
                    $form.prepend('<div class="alert alert-danger form-error-message" style="margin-bottom: 20px;">Please fill in all required fields.</div>');
                }
                return false;
            }
            
            // reCAPTCHA (settings come from the form's data attributes; absent = not configured)
            var version = $form.data('recaptcha-version');
            var siteKey = $form.data('recaptcha-site-key');

            if (version === 'v2') {
                var answered = window.grecaptcha && grecaptcha.getResponse && grecaptcha.getResponse();
                if (!answered) {
                    e.preventDefault();
                    showFormError($form, 'Please tick "I\'m not a robot" before sending.');
                    return false;
                }
            }

            if (version === 'v3' && siteKey && !$form.data('recaptcha-ready')) {
                e.preventDefault();
                var $button = $form.find('[type=submit]').prop('disabled', true).val('Sending...');
                var fail = function () {
                    $button.prop('disabled', false).val('Send message');
                    showFormError($form, 'We could not verify your message. Please check your connection and try again.');
                };
                if (!window.grecaptcha || !grecaptcha.ready) { fail(); return false; }
                grecaptcha.ready(function () {
                    grecaptcha.execute(siteKey, { action: 'contact' }).then(function (token) {
                        $form.find('input[name="g-recaptcha-response"]').val(token);
                        $form.data('recaptcha-ready', true);
                        $form[0].submit(); // native submit: skips this handler
                    }, fail);
                });
                return false;
            }

            // If valid, allow form submission (page will reload)
            return true;
        });

        function showFormError($form, text) {
            $('.form-error-message').remove();
            $form.prepend($('<div class="alert alert-danger form-error-message" style="margin-bottom: 20px;"></div>').text(text));
        }

        // Load Google's reCAPTCHA script only when the form is set up for it
        var $recaptchaForm = $('#contactForm form[data-recaptcha-site-key]');
        if ($recaptchaForm.length) {
            var rcVersion = $recaptchaForm.data('recaptcha-version');
            var rcKey = $recaptchaForm.data('recaptcha-site-key');
            var rc = document.createElement('script');
            rc.src = rcVersion === 'v3'
                ? 'https://www.google.com/recaptcha/api.js?render=' + encodeURIComponent(rcKey)
                : 'https://www.google.com/recaptcha/api.js';
            rc.async = true;
            rc.defer = true;
            document.head.appendChild(rc);
        }

        // Clear error message when user starts typing
        $('#contactForm .form-control').on('input', function() {
            $(this).removeClass('error');
            $(this).closest('.form-group').removeClass('has-error');
            $('.form-error-message').remove();
        });

        // Auto-dismiss alerts after 5 seconds
        setTimeout(function() {
            $('.alert').not('.form-error-message').fadeOut('slow');
        }, 5000);

        // If there are flash messages and the form was submitted, keep the form open
        if ($('#contactForm').data('keep-open')) {
            $('#contactForm').addClass('active').show();
            $('.open-form').text($('.open-form').data('text-close') || 'Close form');
        }
    });
