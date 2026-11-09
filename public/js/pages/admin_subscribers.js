// Page script carried over from views/admin_subscribers.ejs
/*--- script 0 ---*/

        // Copy single email
        function copyEmail(email) {
            navigator.clipboard.writeText(email).then(() => {
                showToast('Email copied to clipboard: ' + email);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = email;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showToast('Email copied to clipboard: ' + email);
            });
        }

        // Copy all emails
        function copyAllEmails() {
            const emails = [];
            document.querySelectorAll('.table-row').forEach(row => {
                const email = row.querySelector('.email-address').textContent;
                emails.push(email);
            });
            
            if (emails.length === 0) {
                showToast('No emails to copy');
                return;
            }
            
            const emailText = emails.join('\n');
            navigator.clipboard.writeText(emailText).then(() => {
                showToast('All ' + emails.length + ' emails copied to clipboard');
            }).catch(err => {
                console.error('Failed to copy: ', err);
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = emailText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showToast('All ' + emails.length + ' emails copied to clipboard');
            });
        }

        // Export emails as text file
        function exportEmails() {
            const emails = [];
            document.querySelectorAll('.table-row').forEach(row => {
                const email = row.querySelector('.email-address').textContent;
                const date = row.querySelector('div:nth-child(3) div').textContent;
                emails.push(email + ' - ' + date);
            });
            
            if (emails.length === 0) {
                showToast('No emails to export');
                return;
            }
            
            const emailText = emails.join('\n');
            const blob = new Blob([emailText], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'subscribers_' + new Date().toISOString().split('T')[0] + '.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            showToast('Exported ' + emails.length + ' emails as text file');
        }

        // Send test email (placeholder)
        function sendTestEmail() {
            const emailCount = Number(document.getElementById('subscriber-data').dataset.count || 0);
            if (emailCount === 0) {
                alert('No subscribers to send test email to.');
                return;
            }
            
            if (confirm('This would send a test email to all ' + emailCount + ' subscribers. Continue?')) {
                showToast('Test email feature would be implemented with your email service provider.');
            }
        }

        // Search emails
        function searchEmails() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
            const rows = document.querySelectorAll('.table-row');
            let visibleCount = 0;
            
            rows.forEach(row => {
                const email = row.getAttribute('data-email');
                if (!searchTerm || email.includes(searchTerm)) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });
            
            // Update count display
            const countBadge = document.querySelector('.badge.bg-secondary');
            if (countBadge) {
                countBadge.textContent = visibleCount + ' of ' + rows.length + ' subscribers';
            }
        }

        // Toast notification
        function showToast(message) {
            // Remove existing toasts
            const existingToasts = document.querySelectorAll('.custom-toast');
            existingToasts.forEach(toast => toast.remove());
            
            // Create toast element
            const toast = document.createElement('div');
            toast.className = 'custom-toast position-fixed bottom-0 end-0 p-3';
            toast.style.zIndex = '1050';
            
            toast.innerHTML = `
                <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header bg-success text-white">
                        <strong class="me-auto"><i class="fa fa-check-circle me-1"></i>Success</strong>
                        <button type="button" class="btn-close btn-close-white" onclick="this.closest('.custom-toast').remove()"></button>
                    </div>
                    <div class="toast-body">
                        ${message}
                    </div>
                </div>
            `;
            
            document.body.appendChild(toast);
            
            // Auto remove after 3 seconds
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 3000);
        }

        // Search on Enter key
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchEmails();
                }
            });
        }

        // Auto-focus search input
        if (searchInput) {
            searchInput.focus();
        }

        // Format dates nicely
        document.addEventListener('DOMContentLoaded', function() {
            // Add hover effects for copy buttons
            document.querySelectorAll('.copy-btn').forEach(btn => {
                btn.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.1)';
                });
                btn.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1)';
                });
            });
            
            // Add click effect for copy buttons
            document.querySelectorAll('.copy-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    this.style.color = '#28a745';
                    setTimeout(() => {
                        this.style.color = '#6c757d';
                    }, 500);
                });
            });
        });
