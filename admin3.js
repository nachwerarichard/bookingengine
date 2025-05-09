function attachEventListenersToButtons() {
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            startEditBooking(id);
        });
    });

}

async function startEditBooking(id) {
    try {
        const booking = await fetchData(`${API_BASE_URL}/${id}`);
        document.getElementById('edit-id').value = booking._id;
        document.getElementById('edit-service').value = booking.service;
        document.getElementById('edit-date').value = formatDateForInput(booking.date);
        document.getElementById('edit-time').value = booking.time;
        document.getElementById('edit-name').value = booking.name;
        document.getElementById('edit-email').value = booking.email;

        document.getElementById('edit-modal').classList.remove('hidden');
    } catch (error) {
        showMessage('Failed to load booking details.', 'error', 'edit-message');
    }
}

document.getElementById('edit-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const id = document.getElementById('edit-id').value;
    const updatedBooking = {
        service: document.getElementById('edit-service').value,
        date: document.getElementById('edit-date').value,
        time: document.getElementById('edit-time').value,
        name: document.getElementById('edit-name').value,
        email: document.getElementById('edit-email').value,
    };

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedBooking)
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Booking updated successfully!', 'success', 'edit-message');
            document.getElementById('edit-modal').classList.add('hidden');
            fetchBookings(); // refresh bookings table
        } else {
            showMessage(data.message || 'Failed to update booking.', 'error', 'edit-message');
        }
    } catch (error) {
        showMessage('Error updating booking.', 'error', 'edit-message');
    }
});

document.getElementById('cancel-edit').addEventListener('click', () => {
    document.getElementById('edit-modal').classList.add('hidden');
});



