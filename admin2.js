let currentPage = 1;
let currentSearch = '';

document.getElementById('search-input').addEventListener('input', (e) => {
    currentSearch = e.target.value;
    currentPage = 1;
    fetBookings();
});

document.getElementById('prev-button').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetBookings();
    }
});

document.getElementById('next-button').addEventListener('click', () => {
    currentPage++;
    fetBookings();
});

async function fetBookings() {
    const bookingsTableBody = document.querySelector('#bookings-table tbody');
    bookingsTableBody.innerHTML = '<tr><td colspan="7">Loading bookings...</td></tr>';

    try {
        const response = await fetch(`${API_BASE_URL}/admin?search=${encodeURIComponent(currentSearch)}&page=${currentPage}`);
        const data = await response.json();

        const bookings = data.bookings;
        const totalPages = data.totalPages;

        bookingsTableBody.innerHTML = '';

        if (!bookings || bookings.length === 0) {
            bookingsTableBody.innerHTML = '<tr><td colspan="7">No bookings found.</td></tr>';
            return;
        }

        bookings.forEach(booking => {
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

        document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
        document.getElementById('prev-button').disabled = currentPage === 1;
        document.getElementById('next-button').disabled = currentPage === totalPages;

        attachEventListenersToButtons();
    } catch (error) {
        bookingsTableBody.innerHTML = '<tr><td colspan="7">Failed to load bookings.</td></tr>';
    }
}
