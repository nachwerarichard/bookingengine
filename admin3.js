// Open and fill the edit modal
function openEditModal(booking) {
  document.getElementById('edit-id').value = booking._id;
  document.getElementById('edit-service').value = booking.service;
  document.getElementById('edit-date').value = booking.date.split('T')[0];
  document.getElementById('edit-time').value = booking.time;
  document.getElementById('edit-name').value = booking.name;
  document.getElementById('edit-email').value = booking.email;

  document.getElementById('edit-modal').style.display = 'block';
}

// Attach click listeners to edit buttons
function attachEventListenersToButtons() {
  document.querySelectorAll('.edit-button').forEach(button => {
    button.addEventListener('click', async () => {
      const id = button.getAttribute('data-id');

      try {
        const response = await fetch(`${API_BASE_URL}/bookings/${id}`);
        if (!response.ok) throw new Error('Failed to fetch booking');

        const booking = await response.json();
        openEditModal(booking);
      } catch (error) {
        alert('Error fetching booking: ' + error.message);
      }
    });
  });
}

// Save edits from the edit form
document.getElementById('edit-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const updatedBooking = {
    id: document.getElementById('edit-id').value,
    service: document.getElementById('edit-service').value,
    date: document.getElementById('edit-date').value,
    time: document.getElementById('edit-time').value,
    name: document.getElementById('edit-name').value,
    email: document.getElementById('edit-email').value
  };

  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${updatedBooking.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedBooking)
    });

    if (!response.ok) throw new Error('Failed to update booking');
    alert('Booking updated!');
    document.getElementById('edit-modal').style.display = 'none';
    fetchBookings();
  } catch (error) {
    alert('Update error: ' + error.message);
  }
});

// Optional: close modal when clicking outside it
window.addEventListener('click', function (e) {
  const modal = document.getElementById('edit-modal');
  if (e.target === modal) modal.style.display = 'none';
});
