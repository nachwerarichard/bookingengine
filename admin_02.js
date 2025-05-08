// Get modal elements
const createModal = document.getElementById('create-booking-modal');
const editModal = document.getElementById('edit-booking-modal');

// Get open buttons
const openCreateBtn = document.getElementById('open-create-modal');

// Get close buttons
const closeCreateBtn = document.getElementById('close-create-modal');
const closeEditBtn = document.getElementById('close-edit-modal');

// Open modals
openCreateBtn.addEventListener('click', () => {
  createModal.style.display = 'block';
});

function openEditModal(data) {
  editModal.style.display = 'block';
  // Fill form fields with existing booking data
  document.getElementById('edit-id').value = data.id;
  document.getElementById('edit-service').value = data.service;
  document.getElementById('edit-date').value = data.date;
  document.getElementById('edit-time').value = data.time;
  document.getElementById('edit-name').value = data.name;
  document.getElementById('edit-email').value = data.email;
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
