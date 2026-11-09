// Page script carried over from views/gallery.ejs
/*--- script 0 ---*/

        $(document).ready(function() {
            // Gallery Filter Functionality
            $('.filter-btn').on('click', function() {
                // Remove active class from all buttons
                $('.filter-btn').removeClass('active');
                // Add active class to clicked button
                $(this).addClass('active');
                
                const filterValue = $(this).data('filter');
                
                // Hide all sections first
                $('.gallery-section').hide();
                
                // Show the appropriate section
                if (filterValue === 'all') {
                    $('#all-photos').show();
                } else if (filterValue === 'rooms') {
                    $('#rooms-section').show();
                } else if (filterValue === 'facilities') {
                    $('#facilities-section').show();
                } else if (filterValue === 'dining') {
                    $('#dining-section').show();
                } else if (filterValue === 'events') {
                    $('#events-section').show();
                } else if (filterValue === 'exterior') {
                    $('#exterior-section').show();
                }
            });

            // Initialize Magnific Popup for image lightbox
            $('.cards figure a').magnificPopup({
                type: 'image',
                gallery: {
                    enabled: true
                },
                zoom: {
                    enabled: true,
                    duration: 300,
                    easing: 'ease-in-out'
                },
                image: {
                    titleSrc: function(item) {
                        return item.el.attr('title');
                    }
                }
            });

            // Handle image errors
            $('img').on('error', function() {
                if (!$(this).attr('data-placeholder-set')) {
                    $(this).attr('src', '/assets/images/header-1.jpg');
                    $(this).attr('data-placeholder-set', 'true');
                }
            });
        });
