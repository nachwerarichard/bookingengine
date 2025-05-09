const createModal = document.getElementById('create-booking-modal');
const editModal = document.getElementById('edit-booking-modal');

const openCreateBtn = document.getElementById('open-create-modal');
const closeCreateBtn = document.getElementById('close-create-modal');
const closeEditBtn = document.getElementById('close-edit-modal');

// Open Create Modal
openCreateBtn.addEventListener('click', () => {
  createModal.style.display = 'block';
});

// Close Modals
closeCreateBtn.addEventListener('click', () => {
  createModal.style.display = 'none';
});
closeEditBtn.addEventListener('click', () => {
  editModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === createModal) createModal.style.display = 'none';
  if (e.target === editModal) editModal.style.display = 'none';
});

// Function to open Edit Modal with booking data
//function openEditModal(booking) {
 // document.getElementById('edit-id').value = booking.id;
 // document.getElementById('edit-service').value = booking.service;
  //document.getElementById('edit-date').value = booking.date;
  //document.getElementById('edit-time').value = booking.time;
  //document.getElementById('edit-name').value = booking.name;
 // document.getElementById('edit-email').value = booking.email;
 // editModal.style.display = 'block';
}
//
// Example usage: Add Edit button handler in your table rendering logic
// Assume 'booking' is an object with relevant data
/*
<button onclick="openEditModal({
  id: 1,
  service: 'room',
  date: '2025-05-10',
  time: '10:00',
  name: 'John Doe',
  email: 'john@example.com'
})">Edit</button>
*/
