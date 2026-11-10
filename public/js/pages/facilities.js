// Page script carried over from views/facilities.ejs
/*--- script 0 ---*/

        $(document).ready(function() {
            // Initialize owl carousels
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

            // Tab functionality
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                // Refresh any carousels in the active tab
                var target = $(e.target).attr("href");
                $(target).find('.owl-carousel').owlCarousel('refresh');
            });

            // Facility booking modal functionality
            $('.book-facility-btn').on('click', function() {
                const facilityName = $(this).data('facility');
                $('#modalFacilityName').val(facilityName);
                $('#bookingModalLabel').text('Book ' + facilityName);
                $('#bookingModal').modal('show');
            });

            // Form validation
            $('#facilityBookingForm').on('submit', function(e) {
                const bookingDate = $('#bookingDate').val();
                const bookingTime = $('#bookingTime').val();
                
                if (!bookingDate || !bookingTime) {
                    e.preventDefault();
                    alert('Please select both date and time for your booking.');
                    return false;
                }
                
                // Additional validation can be added here
                return true;
            });

            // Set minimum date to today
            const today = new Date().toISOString().split('T')[0];
            $('#bookingDate').attr('min', today);

            // Auto-dismiss alerts after 5 seconds
            setTimeout(function() {
                $('.alert').fadeOut('slow');
            }, 5000);
        });
