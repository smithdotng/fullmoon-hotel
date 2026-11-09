// Page script carried over from views/rooms_detail.ejs
/*--- script 0 ---*/

    $(document).ready(function () {
        // Initialize guest counter with clean state
        initializeGuestCounter();
    });

    function initializeGuestCounter() {
        var $guests = $('.guests');
        var $guestList = $guests.find('.guest-list');
        var $result = $guests.find('.result');
        
        // Clean up ALL existing event handlers first
        $guests.off('click');
        $result.off('click');
        $guestList.off('click');
        $guestList.find('.qty-btn').off('click');
        $guestList.find('.qty-apply').off('click');
        $guestList.find('.qty-close').off('click');
        $(document).off('click.guestDropdown');
        $(document).off('keydown.guestDropdown');
        
        // Set initial values
        $('#ticket-adult').val('1');
        $('#ticket-children').val('0');
        $('#ticket-infants').val('0');
        updateGuestSummary();
        updateButtonStates();

        // 1. OPEN/CLOSE DROPDOWN
        $result.on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Close other dropdowns if any
            $('.guest-list.open').not($guestList).removeClass('open');
            
            // Toggle this dropdown
            $guestList.toggleClass('open');
        });

        // 2. PREVENT CLICKS INSIDE DROPDOWN FROM CLOSING
        $guestList.on('click', function(e) {
            e.stopPropagation();
        });

        // 3. PLUS/MINUS BUTTONS - Simple, direct handling
        $guestList.find('.qty-btn').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            var $button = $(this);
            var field = $button.data('field');
            var isPlus = $button.hasClass('qty-plus');
            var isMinus = $button.hasClass('qty-minus');
            
            var $input;
            switch(field) {
                case 'adult':
                    $input = $('#ticket-adult');
                    break;
                case 'children':
                    $input = $('#ticket-children');
                    break;
                case 'infant':
                    $input = $('#ticket-infants');
                    break;
                default:
                    return;
            }
            
            var currentVal = parseInt($input.val(), 10) || 0;
            
            if (isPlus) {
                // Add exactly 1
                $input.val(currentVal + 1);
            } else if (isMinus) {
                // Subtract exactly 1, with minimum constraints
                if (field === 'adult') {
                    // Adults: minimum 1
                    if (currentVal > 1) {
                        $input.val(currentVal - 1);
                    }
                } else {
                    // Children and infants: minimum 0
                    if (currentVal > 0) {
                        $input.val(currentVal - 1);
                    }
                }
            }
            
            updateGuestSummary();
            updateButtonStates();
        });

        // 4. APPLY BUTTON
        $guestList.find('.qty-apply').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $guestList.removeClass('open');
        });

        // 5. CLOSE BUTTON (X)
        $guestList.find('.qty-close').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $guestList.removeClass('open');
        });

        // 6. CLOSE DROPDOWN WHEN CLICKING OUTSIDE
        $(document).on('click.guestDropdown', function(e) {
            if (!$guests.is(e.target) && $guests.has(e.target).length === 0) {
                $guestList.removeClass('open');
            }
        });

        // 7. ESCAPE KEY TO CLOSE
        $(document).on('keydown.guestDropdown', function(e) {
            if (e.keyCode === 27 && $guestList.hasClass('open')) {
                $guestList.removeClass('open');
            }
        });

        // Helper functions
        function updateGuestSummary() {
            var adults = parseInt($('#ticket-adult').val(), 10) || 0;
            var children = parseInt($('#ticket-children').val(), 10) || 0;
            var infants = parseInt($('#ticket-infants').val(), 10) || 0;
            var total = adults + children + infants;
            
            // Ensure minimum values
            if (adults < 1) {
                adults = 1;
                $('#ticket-adult').val(1);
            }
            if (children < 0) {
                children = 0;
                $('#ticket-children').val(0);
            }
            if (infants < 0) {
                infants = 0;
                $('#ticket-infants').val(0);
            }
            
            total = adults + children + infants;
            
            $('#qty-result').val(total);
            $('#qty-result-text').text(total); // live site shows the number only
        }

        function updateButtonStates() {
            // Adults
            var adults = parseInt($('#ticket-adult').val(), 10) || 0;
            $guestList.find('[data-field="adult"].qty-minus').prop('disabled', adults <= 1);
            
            // Children
            var children = parseInt($('#ticket-children').val(), 10) || 0;
            $guestList.find('[data-field="children"].qty-minus').prop('disabled', children <= 0);
            
            // Infants
            var infants = parseInt($('#ticket-infants').val(), 10) || 0;
            $guestList.find('[data-field="infant"].qty-minus').prop('disabled', infants <= 0);
        }
    }
