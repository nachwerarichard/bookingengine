let currentPage = 1;
const rowsPerPage = 4;
let allBookings = [];

function renderTable() {
    const bookingsTableBody = document.querySelector('#bookings-table tbody');
    bookingsTableBody.innerHTML = '';

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedBookings = allBookings.slice(start, end);

    paginatedBookings.forEach(booking => {
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

    updatePaginationControls();
    attachEventListenersToButtons();
}

function updatePaginationControls() {
    const totalPages = Math.ceil(allBookings.length / rowsPerPage);
    document.getElementById('page-indicator').textContent = `Page ${currentPage}`;

    document.getElementById('prev-button').disabled = currentPage === 1;
    document.getElementById('next-button').disabled = currentPage === totalPages;
}

document.getElementById('prev-button').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
});

document.getElementById('next-button').addEventListener('click', () => {
    const totalPages = Math.ceil(allBookings.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
});
