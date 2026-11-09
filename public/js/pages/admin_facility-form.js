// Page script carried over from views/admin_facility-form.ejs
/*--- script 0 ---*/

document.addEventListener('DOMContentLoaded', function() {
    const requiresGuestsCheckbox = document.getElementById('requiresGuests');
    const guestsSection = document.getElementById('guestsSection');

    requiresGuestsCheckbox.addEventListener('change', function() {
        guestsSection.style.display = this.checked ? 'block' : 'none';
    });

    // Initialize guests section based on current state
    if (requiresGuestsCheckbox.checked) {
        guestsSection.style.display = 'block';
    }
});
