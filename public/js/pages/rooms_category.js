// Page script carried over from views/rooms_category.ejs
/*--- script 0 ---*/

        $(document).ready(function() {
            // Initialize each room gallery separately
            $('.owl-slider-gallery').each(function() {
                var $this = $(this);
                var roomId = $this.data('room-id');
                var $thumbnails = $('#thumbnails-' + roomId);
                
                var owl = $this.owlCarousel({
                    items: 1,
                    loop: true,
                    nav: true,
                    dots: true,
                    autoplay: true,
                    autoplayTimeout: 5000,
                    autoplayHoverPause: true,
                    navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
                    onInitialized: function(event) {
                        updateThumbnailActiveState(event.item.index, $thumbnails);
                    },
                    onChanged: function(event) {
                        updateThumbnailActiveState(event.item.index, $thumbnails);
                    }
                });
                
                // Thumbnail click handler
                if ($thumbnails.length > 0) {
                    $thumbnails.find('.thumb').on('click', function() {
                        var index = $(this).data('index');
                        owl.trigger('to.owl.carousel', [index, 300]);
                    });
                }
            });
            
            function updateThumbnailActiveState(currentIndex, $thumbnails) {
                if ($thumbnails.length > 0) {
                    $thumbnails.find('.thumb').removeClass('active');
                    $thumbnails.find('.thumb[data-index="' + currentIndex + '"]').addClass('active');
                }
            }
            
            // Handle unavailable room interactions
            $('.room-unavailable .owl-slider-gallery').each(function() {
                var $this = $(this);
                
                // Stop autoplay for unavailable rooms
                $this.trigger('stop.owl.autoplay');
                
                // Disable navigation clicks
                $this.find('.owl-nav').css('pointer-events', 'none').css('opacity', '0.5');
                
                // Disable dot navigation
                $this.find('.owl-dots').css('pointer-events', 'none').css('opacity', '0.5');
            });
            
            // Show tooltip on unavailable room images
            $('.room-unavailable .room-gallery').on('click', function(e) {
                e.preventDefault();
                var $room = $(this).closest('.room');
                var roomNumber = $room.find('.room-header small').text() || 'this room';
                
                // Create a simple alert
                alert('Room ' + roomNumber + ' is currently booked. Please check other available rooms or different dates.');
            });
            
            // Guest counter and datepicker script (same as before)
            var $guests = $('.guests');
            if ($guests.length > 0) {
                var $guestList = $guests.find('.guest-list');
                var $result = $guests.find('.result');
                var $closeBtn = $guests.find('.qty-close');
                var $applyBtn = $guests.find('.qty-apply');
                var isDropdownOpen = false;

                $result.on('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $guestList.toggleClass('open');
                    isDropdownOpen = $guestList.hasClass('open');
                });

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

                $guestList.on('click', function(e) {
                    e.stopPropagation();
                });

                $(document).on('click', function(e) {
                    if (isDropdownOpen && !$guests.is(e.target) && $guests.has(e.target).length === 0) {
                        closeDropdown();
                    }
                });

                $guests.find('.qty-btn').off('click').on('click', function(e) {
                    e.stopPropagation();
                    var $this = $(this);
                    var field = $this.data('field');
                    var $input = $('#' + field);
                    var currentVal = parseInt($input.val()) || 0;

                    if ($this.hasClass('qty-plus')) {
                        $input.val(currentVal + 1).attr('data-value', currentVal + 1);
                    } else if ($this.hasClass('qty-minus') && currentVal > 0) {
                        $input.val(currentVal - 1).attr('data-value', currentVal - 1);
                    }

                    updateGuestSummary();
                });

                function updateGuestSummary() {
                    var adults = parseInt($('#ticket-adult').val()) || 0;
                    var children = parseInt($('#ticket-children').val()) || 0;
                    var infants = parseInt($('#ticket-infants').val()) || 0;
                    var total = adults + children + infants;

                    $('#qty-result').val(total);
                    $('#qty-result-text').text(total); // live site shows the number only
                }

                updateGuestSummary();

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
            }
            
            // Add lightbox functionality for category images
            $('.cards figure').each(function() {
                var $figure = $(this);
                var $image = $figure.find('img');
                var src = $image.attr('src');
                var alt = $image.attr('alt');
                
                $figure.find('figcaption').css('cursor', 'pointer').on('click', function() {
                    window.open(src, '_blank');
                });
            });
        });
