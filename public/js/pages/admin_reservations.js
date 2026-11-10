// Page script carried over from views/admin_reservations.ejs
/*--- script 0 ---*/

        $(document).ready(function() {
            $('#reservationsTable').DataTable({
                pageLength: 25,
                order: [[0, 'desc']],
                language: {
                    search: "Search reservations:",
                    lengthMenu: "Show _MENU_ reservations per page",
                    info: "Showing _START_ to _END_ of _TOTAL_ reservations",
                    paginate: {
                        first: "First",
                        last: "Last",
                        next: "Next",
                        previous: "Previous"
                    }
                },
                columnDefs: [
                    { orderable: true, targets: [0, 1, 2, 3, 4, 5, 6] },
                    { orderable: false, targets: [7] } // Actions column
                ]
            });
        });

        function checkIn(reservationId) {
            if (confirm('Are you sure you want to check in this guest? This will mark the room as occupied.')) {
                // Create a form and submit it
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = `/admin/reservations/checkin/${reservationId}`;
                document.body.appendChild(form);
                form.submit();
            }
        }

        function checkOut(reservationId) {
            if (confirm('Are you sure you want to check out this guest? This will free up the room.')) {
                // Create a form and submit it
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = `/admin/reservations/checkout/${reservationId}`;
                document.body.appendChild(form);
                form.submit();
            }
        }

        function quickCheckOut(reservationId) {
            if (confirm('Process check-out without extra charges?')) {
                // Create a form and submit it
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = `/admin/reservations/checkout/${reservationId}`;
                document.body.appendChild(form);
                form.submit();
            }
        }

        function confirmPayment(reservationId) {
            const amount = prompt('Enter payment amount:', '');
            if (amount !== null) {
                const paymentMethod = prompt('Payment method (Cash, Card, Transfer):', 'Cash');
                if (paymentMethod !== null) {
                    const transactionId = prompt('Transaction ID (optional):', '');
                    
                    // Create a form and submit it
                    const form = document.createElement('form');
                    form.method = 'POST';
                    form.action = `/admin/reservations/confirm-payment/${reservationId}`;
                    
                    // Add hidden inputs
                    const paymentAmount = document.createElement('input');
                    paymentAmount.type = 'hidden';
                    paymentAmount.name = 'paymentAmount';
                    paymentAmount.value = amount;
                    form.appendChild(paymentAmount);
                    
                    const method = document.createElement('input');
                    method.type = 'hidden';
                    method.name = 'paymentMethod';
                    method.value = paymentMethod;
                    form.appendChild(method);
                    
                    if (transactionId && transactionId.trim() !== '') {
                        const transaction = document.createElement('input');
                        transaction.type = 'hidden';
                        transaction.name = 'transactionId';
                        transaction.value = transactionId;
                        form.appendChild(transaction);
                    }
                    
                    document.body.appendChild(form);
                    form.submit();
                }
            }
        }

        function cancelReservation(reservationId) {
            const reason = prompt('Please enter cancellation reason:', '');
            if (reason !== null && reason.trim() !== '') {
                // Create a form and submit it
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = `/admin/reservations/cancel/${reservationId}`;
                
                const cancellationReason = document.createElement('input');
                cancellationReason.type = 'hidden';
                cancellationReason.name = 'cancellationReason';
                cancellationReason.value = reason;
                form.appendChild(cancellationReason);
                
                document.body.appendChild(form);
                form.submit();
            }
        }

        function earlyCheckOut(reservationId) {
            const reason = prompt('Reason for early check-out:', '');
            if (reason !== null) {
                const refund = prompt('Refund amount (if any):', '0');
                if (refund !== null) {
                    // Create a form and submit it
                    const form = document.createElement('form');
                    form.method = 'POST';
                    form.action = `/admin/reservations/early-checkout/${reservationId}`;
                    
                    // Add hidden inputs
                    const earlyReason = document.createElement('input');
                    earlyReason.type = 'hidden';
                    earlyReason.name = 'reason';
                    earlyReason.value = reason;
                    form.appendChild(earlyReason);
                    
                    const refundAmount = document.createElement('input');
                    refundAmount.type = 'hidden';
                    refundAmount.name = 'refundAmount';
                    refundAmount.value = refund;
                    form.appendChild(refundAmount);
                    
                    document.body.appendChild(form);
                    form.submit();
                }
            }
        }

        function assignRoom(reservationId) {
            // In a real implementation, this would open a modal with available rooms
            // For now, redirect to the reservation details page
            window.location.href = `/admin/reservations/${reservationId}#assign-room`;
        }

        // Auto-refresh every 5 minutes
        setTimeout(function() {
            window.location.reload();
        }, 5 * 60 * 1000);
