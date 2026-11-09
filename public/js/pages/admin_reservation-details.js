// Page script carried over from views/admin_reservation-details.ejs
/*--- script 0 ---*/

        // Show/hide payment method fields
        const paymentMethodSelect = document.getElementById('paymentMethod');
        if (paymentMethodSelect) {
            paymentMethodSelect.addEventListener('change', function() {
                // Hide all method-specific fields
                document.querySelectorAll('.payment-method-fields').forEach(field => {
                    field.style.display = 'none';
                    field.querySelectorAll('input, select').forEach(input => {
                        input.removeAttribute('required');
                    });
                });
                
                const selectedMethod = this.value;
                if (selectedMethod === 'cash') {
                    const cashFields = document.getElementById('cashFields');
                    if (cashFields) {
                        cashFields.style.display = 'block';
                        document.querySelectorAll('#cashFields input').forEach(input => {
                            input.setAttribute('required', 'required');
                        });
                    }
                } else if (selectedMethod === 'transfer') {
                    const transferFields = document.getElementById('transferFields');
                    if (transferFields) {
                        transferFields.style.display = 'block';
                        document.querySelectorAll('#transferFields input').forEach(input => {
                            input.setAttribute('required', 'required');
                        });
                    }
                } else if (selectedMethod === 'pos') {
                    const posFields = document.getElementById('posFields');
                    if (posFields) {
                        posFields.style.display = 'block';
                        document.querySelectorAll('#posFields input, #posFields select').forEach(input => {
                            input.setAttribute('required', 'required');
                        });
                    }
                }
            });
        }
