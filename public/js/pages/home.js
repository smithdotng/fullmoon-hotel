// Page script carried over from views/home.ejs
/*--- script 0 ---*/

        $(document).ready(function() {
            var $guests = $('.guests');
            if ($guests.length === 0) return;

            var $guestList = $guests.find('.guest-list');
            var $result = $guests.find('.result');
            var $closeBtn = $guests.find('.qty-close');
            var $applyBtn = $guests.find('.qty-apply');
            
            // Set initial values to 1 adult, 0 children, 0 infants
            $('#ticket-adult').val('1').attr('data-value', '1');
            $('#ticket-children').val('0').attr('data-value', '0');
            $('#ticket-infants').val('0').attr('data-value', '0');
            
            updateGuestSummary();
            updateButtonStates();

            var isDropdownOpen = false;

            // Toggle dropdown on result click
            $result.on('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                $guestList.toggleClass('open');
                isDropdownOpen = $guestList.hasClass('open');
            });

            // Close on X or Apply
            $closeBtn.on('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                closeDropdown();
            });

            $applyBtn.on('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                closeDropdown();
            });

            function closeDropdown() {
                $guestList.removeClass('open');
                isDropdownOpen = false;
            }

            // Prevent closing when clicking inside dropdown
            $guestList.on('click', function(e) {
                e.stopPropagation();
            });

            // Close when clicking outside
            $(document).on('click', function(e) {
                if (isDropdownOpen && !$guests.is(e.target) && $guests.has(e.target).length === 0) {
                    closeDropdown();
                }
            });

            // Guest counter - FIXED: Use button elements and proper event handling
            $guests.find('.qty-btn').off('click').on('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                
                var $this = $(this);
                var field = $this.data('field');
                var $input = $('#' + field);
                var currentVal = parseInt($input.val()) || 0;
                var newVal = currentVal;

                if ($this.hasClass('qty-plus')) {
                    newVal = currentVal + 1;
                } else if ($this.hasClass('qty-minus')) {
                    if (field === 'ticket-adult') {
                        // Adults: minimum 1
                        newVal = Math.max(1, currentVal - 1);
                    } else {
                        // Children and infants: minimum 0
                        newVal = Math.max(0, currentVal - 1);
                    }
                }

                $input.val(newVal).attr('data-value', newVal);
                
                updateGuestSummary();
                updateButtonStates();
            });

            function updateGuestSummary() {
                var adults = parseInt($('#ticket-adult').val()) || 0;
                var children = parseInt($('#ticket-children').val()) || 0;
                var infants = parseInt($('#ticket-infants').val()) || 0;
                var total = adults + children + infants;

                $('#qty-result').val(total);
                
                // The live site shows just the number here (theme styling expects a digit)
                $('#qty-result-text').text(total);
            }
            
            function updateButtonStates() {
                // Adult minus button - disabled when adults = 1
                var adults = parseInt($('#ticket-adult').val()) || 0;
                $guests.find('[data-field="ticket-adult"].qty-minus').prop('disabled', adults <= 1);
                
                // Children minus button - disabled when children = 0
                var children = parseInt($('#ticket-children').val()) || 0;
                $guests.find('[data-field="ticket-children"].qty-minus').prop('disabled', children <= 0);
                
                // Infants minus button - disabled when infants = 0
                var infants = parseInt($('#ticket-infants').val()) || 0;
                $guests.find('[data-field="ticket-infants"].qty-minus').prop('disabled', infants <= 0);
            }

            // Datepicker with display update
            if ($.fn.datepicker) {
                $('.datepicker').datepicker({
                    minDate: 0,
                    dateFormat: 'dd MM yy',
                    showOtherMonths: true,
                    dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                    onSelect: function(dateText) {
                        $(this).val(dateText);
                        
                        var $parent = $(this).closest('.date');
                        var $valueDiv = $parent.find('.date-value');
                        $valueDiv.text(dateText).addClass('filled');
                    }
                });
            }
        });
    
/*--- script 1 ---*/

    $(document).ready(function() {
        console.log('Page loaded - testing subscription...');
        
        // Handle subscription form
        $('#newsletterForm').on('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');
            
            const email = $('#newsletterEmail').val().trim();
            const $message = $('#newsletterMessage');
            
            // Clear previous messages
            $message.removeClass('success error').hide().empty();
            
            // Validation
            if (!email) {
                showMessage('Please enter your email address.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading
            const $button = $('#subscribe-button');
            const $buttonText = $('#subscribe-text');
            const $spinner = $('#subscribe-spinner');
            const originalText = $buttonText.text();
            
            $button.prop('disabled', true);
            $buttonText.text('Subscribing...');
            $spinner.show();
            
            // Send request
            $.ajax({
                url: '/subscribe',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ email: email }),
                dataType: 'json',
                success: function(response) {
                    console.log('Success response:', response);
                    if (response.success) {
                        showMessage(response.message, 'success');
                        $('#newsletterEmail').val('');
                    } else {
                        showMessage(response.message, 'error');
                    }
                },
                error: function(xhr, status, error) {
                    console.error('AJAX Error:', {
                        status: xhr.status,
                        statusText: xhr.statusText,
                        response: xhr.responseText,
                        error: error
                    });
                    
                    let message = 'An error occurred. Please try again.';
                    
                    if (xhr.status === 404) {
                        message = 'Subscription service not found. Please contact support.';
                    } else if (xhr.status === 400) {
                        try {
                            const data = JSON.parse(xhr.responseText);
                            message = data.message || message;
                        } catch (e) {
                            message = 'Invalid email address.';
                        }
                    }
                    
                    showMessage(message, 'error');
                },
                complete: function() {
                    $button.prop('disabled', false);
                    $buttonText.text(originalText);
                    $spinner.hide();
                }
            });
        });
        
        function isValidEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
        
        function showMessage(text, type) {
            const $message = $('#newsletterMessage');
            const icon = type === 'success' ? '✓' : '✗';
            
            $message.html(`${icon} ${text}`)
                   .addClass(type)
                   .fadeIn();
            
            // Auto-hide success messages after 5 seconds
            if (type === 'success') {
                setTimeout(() => {
                    $message.fadeOut();
                }, 5000);
            }
        }
    });
