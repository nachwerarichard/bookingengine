// Get modal elements
const createModal = document.getElementById('create-booking-modal');
const editModal = document.getElementById('edit-booking-modal');

// Get open buttons
const openCreateBtn = document.getElementById('open-create-modal');
const openEditBtn = document.getElementById('open-edit-modal');

// Get close buttons
const closeCreateBtn = document.getElementById('close-create-modal');
const closeEditBtn = document.getElementById('close-edit-modal');

// Open modals
openCreateBtn.addEventListener('click', () => {
  createModal.style.display = 'block';
});

openEditBtn.addEventListener('click', () => {
  editModal.style.display = 'block';
});



function openEditModal(booking) {
  const editModal = document.getElementById('edit-booking-modal');
  editModal.style.display = 'block';

  document.getElementById('edit-id').value = booking.id;
  document.getElementById('edit-service').value = booking.service;
  document.getElementById('edit-date').value = booking.date;
  document.getElementById('edit-time').value = booking.time;
  document.getElementById('edit-name').value = booking.name;
  document.getElementById('edit-email').value = booking.email;
}

// Close modals
closeCreateBtn.addEventListener('click', () => {
  createModal.style.display = 'none';
});
closeEditBtn.addEventListener('click', () => {
  editModal.style.display = 'none';
});

// Optional: Close modals when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === createModal) createModal.style.display = 'none';
  if (e.target === editModal) editModal.style.display = 'none';
});
