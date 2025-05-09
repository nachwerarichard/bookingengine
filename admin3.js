function attachEventListenersToButtons() {
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            startEditBooking(id);
        });
    });

}
