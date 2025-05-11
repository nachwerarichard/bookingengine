let bookingsData = [];
let filteredData = [];
let currentPage = 1;
const rowsPerPage = 4;

function renderPage() {
  const bookingsTableBody = document.querySelector('#bookings-table tbody');
  bookingsTableBody.innerHTML = '';

  const dataToRender = filteredData.length > 0 || searchInput.value ? filteredData : bookingsData;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, dataToRender.length);
  const currentBookings = dataToRender.slice(startIndex, endIndex);

  if (currentBookings.length === 0) {
    bookingsTableBody.innerHTML = '<tr><td colspan="7">No bookings found.</td></tr>';
    return;
  }

  currentBookings.forEach(booking => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${booking._id}</td>
      <td>${booking.service}</td>
      <td>${new Date(booking.date).toLocaleDateString()}</td>
      <td>${booking.time}</td>
      <td>${booking.name}</td>
      <td>${booking.email}</td>
      <td>
        <button class="edit-button" data-id="${booking._id}">Edit</button>
        <button class="delete-button" data-id="${booking._id}">Delete</button>
      </td>
    `;
    bookingsTableBody.appendChild(row);
  });

  attachEventListenersToButtons();
  updatePaginationControls(dataToRender);
}

function updatePaginationControls(dataSource) {
  const totalPages = Math.ceil(dataSource.length / rowsPerPage);
  document.getElementById('prev-page').disabled = currentPage === 1;
  document.getElementById('next-page').disabled = currentPage === totalPages || totalPages === 0;
  document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
}

document.getElementById('prev-page').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage();
  }
});

document.getElementById('next-page').addEventListener('click', () => {
  const data = filteredData.length > 0 || searchInput.value ? filteredData : bookingsData;
  const totalPages = Math.ceil(data.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderPage();
  }
});

const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', () => {
  const term = searchInput.value.toLowerCase();
  filteredData = bookingsData.filter(b =>
    b.service.toLowerCase().includes(term) ||
    b.name.toLowerCase().includes(term) ||
    b.email.toLowerCase().includes(term)
  );
  currentPage = 1;
  renderPage();
});

async function fetchBookings() {
  const bookingsTableBody = document.querySelector('#bookings-table tbody');
  bookingsTableBody.innerHTML = '<tr><td colspan="7">Loading bookings...</td></tr>';

  try {
    const response = await fetch(`${API_BASE_URL}/admin`);
    const bookings = await response.json();

    if (!bookings || bookings.length === 0) {
      bookingsTableBody.innerHTML = '<tr><td colspan="7">No bookings found.</td></tr>';
      return;
    }

    bookingsData = bookings;
    filteredData = [];
    currentPage = 1;
    renderPage();

  } catch (error) {
    bookingsTableBody.innerHTML = '<tr><td colspan="7">Failed to load bookings. Please check your network and backend.</td></tr>';
    console.error('Fetch error:', error);
  }
}

document.addEventListener('DOMContentLoaded', fetchBookings);
