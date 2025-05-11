let bookingsData = []; // store all bookings
let currentPage = 1;
const rowsPerPage = 4;

async function fetchBookings() {
    const bookingsTableBody = document.querySelector('#bookings-table tbody');
    bookingsTableBody.innerHTML = '<tr><td colspan="7">Loading bookings...</td></tr>';

    try {
        const bookings = await fetchData(`${API_BASE_URL}/admin`);

        if (!bookings || bookings.length === 0) {
            bookingsTableBody.innerHTML = '<tr><td colspan="7">No bookings found.</td></tr>';
            return;
        }

        bookingsData = bookings; // store all bookings
        currentPage = 1;
        renderPage();

    } catch (error) {
        bookingsTableBody.innerHTML = '<tr><td colspan="7">Failed to load bookings. Please check your network and backend.</td></tr>';
    }
}

function renderPage() {
    const bookingsTableBody = document.querySelector('#bookings-table tbody');
    bookingsTableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, bookingsData.length);
    const currentBookings = bookingsData.slice(startIndex, endIndex);

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
    updatePaginationControls();
}

function updatePaginationControls() {
    const totalPages = Math.ceil(bookingsData.length / rowsPerPage);
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
    const totalPages = Math.ceil(bookingsData.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderPage();
    }
});
