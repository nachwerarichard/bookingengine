const API_BASE_URL = 'https://bookingenginebackend.onrender.com/api/bookings'; // Adjust if needed
const ADMIN_LOGIN_URL = 'https://bookingenginebackend.onrender.com/api/admin/login'; // adjust to your actual endpoint

// --- Utility Functions ---

/**
 * Displays a message to the user.
 * @param {string} message - The message to display.
 * @param {string} type - The type of message ('success' or 'error').
 * @param {string} targetId - The ID of the element where the message should be displayed.
 */
function showMessage(message, type, targetId) {
    const messageDiv = document.getElementById(targetId);
    messageDiv.textContent = message;
    messageDiv.className = type;
    messageDiv.classList.remove('hidden');
    setTimeout(() => {
        messageDiv.classList.add('hidden');
        messageDiv.textContent = '';
    }, 5000);
}

/**
 * Fetches data from the API and handles errors.
 * @param {string} url - The URL to fetch.
 * @param {object} options - Optional fetch options.
 * @returns {Promise<object>} - The JSON response from the API.
 */
async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// --- Booking Management ---

/**
 * Fetches all bookings from the API and displays them in a table.
 */
async function fetchBookings() {
    const bookingsTableBody = document.querySelector('#bookings-table tbody');
    bookingsTableBody.innerHTML = '<tr><td colspan="7">Loading bookings...</td></tr>';

    try {
        const bookings = await fetchData(`${API_BASE_URL}/admin`);

        if (!bookings || bookings.length === 0) {
            bookingsTableBody.innerHTML = '<tr><td colspan="7">No bookings found.</td></tr>';
            return;
        }

        bookingsTableBody.innerHTML = '';
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

        attachEventListenersToButtons();

    } catch (error) {
        bookingsTableBody.innerHTML = '<tr><td colspan="7">Failed to load bookings. Please check your network and backend.</td></tr>';
    }
}


function attachEventListenersToButtons() {
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', async () => {
            const row = button.closest('tr');
            const id = button.dataset.id;

            // Get current data from row
            const cells = row.querySelectorAll('td');
            const booking = {
                _id: cells[0].textContent,
                service: cells[1].textContent,
                date: new Date(cells[2].textContent).toISOString().split('T')[0],
                time: cells[3].textContent,
                name: cells[4].textContent,
                email: cells[5].textContent,
            };

            // Replace row with editable inputs
            row.innerHTML = `
                <td>${booking._id}</td>
                <td><input type="text" value="${booking.service}"></td>
                <td><input type="date" value="${booking.date}"></td>
                <td><input type="time" value="${booking.time}"></td>
                <td><input type="text" value="${booking.name}"></td>
                <td><input type="email" value="${booking.email}"></td>
                <td>
                    <button class="save-button" data-id="${booking._id}">Save</button>
                    <button class="cancel-button">Cancel</button>
                </td>
            `;

            row.querySelector('.save-button').addEventListener('click', async () => {
                const inputs = row.querySelectorAll('input');
                const updatedBooking = {
                    service: inputs[0].value,
                    date: inputs[1].value,
                    time: inputs[2].value,
                    name: inputs[3].value,
                    email: inputs[4].value,
                };

                try {
                    const response = await fetch(`${API_BASE_URL}/admin/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedBooking),
                    });

                    if (!response.ok) throw new Error('Failed to update booking');

                    // Re-fetch bookings to update the UI
                    fetchBookings();
                } catch (error) {
                    alert('Error saving booking. Try again.');
                    console.error(error);
                }
            });

            row.querySelector('.cancel-button').addEventListener('click', () => {
                // Re-fetch bookings to revert changes
                fetchBookings();
            });
        });
    });

   
}


// Save button


// Utility to format the displayed date (e.g. "5/9/2025") to "2025-05-09" for input value
function formatDateForInput(dateString) {
    const [month, day, year] = new Date(dateString).toLocaleDateString().split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/**
 * Handles editing a booking.
 * @param {string} id - The ID of the booking to edit.
 */


/**
 * Handles deleting a booking.
 * @param {string} id - The ID of the booking to delete.
 */
async function deleteBooking(id) {
    if (confirm('Are you sure you want to delete this booking?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('Booking deleted successfully!', 'success', 'edit-message');
                fetchBookings();
            } else {
                showMessage(data.message || 'Failed to delete booking.', 'error', 'edit-message');
            }
        } catch (error) {
            showMessage('Error deleting booking. Please check your network.', 'error', 'edit-message');
        }
    }
}

/**
 * Handles the submission of the create booking form.
 */
async function createBookingManual() {
    const createService = document.getElementById('create-service').value;
    const createDate = document.getElementById('create-date').value;
    const createTime = document.getElementById('create-time').value;
    const createName = document.getElementById('create-name').value;
    const createEmail = document.getElementById('create-email').value;

    if (!createService || !createDate || !createTime || !createName || !createEmail) {
        showMessage('Please fill in all fields.', 'error', 'create-message');
        return;
    }

    const newBookingData = {
        service: createService,
        date: createDate,
        time: createTime,
        name: createName,
        email: createEmail,
    };

    try {
        const response = await fetch(`${API_BASE_URL}/manual`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBookingData),
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Booking created successfully!', 'success', 'create-message');
            document.getElementById('create-form').reset();
            fetchBookings();
        } else {
            showMessage(data.message || 'Failed to create booking.', 'error', 'create-message');
        }
    } catch (error) {
        showMessage('Error creating booking. Please check your network.', 'error', 'create-message');
    }
}

/**
 * Attaches event listeners to edit and delete buttons.
 */
function attachEventListenersToButtons() {
    

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', () => {
            const bookingId = button.getAttribute('data-id');
            deleteBooking(bookingId);
        });
    });
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    fetchBookings();
});


    const createForm = document.getElementById('create-form');
    createForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const newBooking = {
            service: document.getElementById('create-service').value,
            date: document.getElementById('create-date').value,
            time: document.getElementById('create-time').value,
            name: document.getElementById('create-name').value,
            email: document.getElementById('create-email').value,
        };

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newBooking)
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('Booking created successfully!', 'success', 'create-message');
                createForm.reset();
                fetchBookings();
            } else {
                showMessage(data.message || 'Failed to create booking.', 'error', 'create-message');
            }
        } catch (error) {
            showMessage('Error creating booking. Please check your network.', 'error', 'create-message');
        }
    });

document.getElementById('admin-login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(ADMIN_LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      // Hide login, show dashboard
      document.getElementById('login-form').classList.add('hidden');
      document.getElementById('dashboard-content').classList.remove('hidden');
      fetchBookings(); // load bookings
    } else {
      showMessage(data.message || 'Login failed.', 'error', 'login-message');
    }
  } catch (err) {
    showMessage('Network error during login.', 'error', 'login-message');
  }
});


