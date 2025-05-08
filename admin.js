const API_BASE_URL = 'https://bookingenginebackend.onrender.com/api/bookings'; // Adjust if needed

// --- Utility Functions ---

/**
 * Displays a message to the user.
 * @param {string} message - The message to display.
 * @param {string} type - The type of message ('success' or 'error').
 * @param {string} targetId - The ID of the element where the message should be displayed.
 */
function showMessage(message, type, targetId) {
    const messageDiv = document.getElementById(targetId);
    if (!messageDiv) return;
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
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// --- Authentication ---

let authToken = localStorage.getItem('authToken');

/**
 * Handles user login.
 */
async function login() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginForm = document.getElementById('login-form');

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
        showMessage('Please enter both username and password.', 'error', 'login-message');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            showMessage('Logged in successfully!', 'success', 'login-message');
            loginForm.classList.add('hidden');
            document.getElementById('login-section').classList.add('hidden');
            document.getElementById('dashboard-content').classList.remove('hidden');
            fetchBookings();
        } else {
            showMessage(data.message || 'Invalid credentials.', 'error', 'login-message');
        }
    } catch (error) {
        showMessage('Failed to login. Please check your network.', 'error', 'login-message');
    } finally {
        loginForm.reset();
    }
}

/**
 * Logs the user out.
 */
function logout() {
    authToken = null;
    localStorage.removeItem('authToken');
    document.getElementById('dashboard-content').classList.add('hidden');
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('login-form').reset();
    const bookingsTableBody = document.querySelector('#bookings-table tbody');
    bookingsTableBody.innerHTML = '<tr><td colspan="6">Please log in to view bookings.</td></tr>';
}

// --- Booking Management ---

/**
 * Fetches all bookings from the API and displays them in a table.
 */
async function fetchBookings() {
    const bookingsTableBody = document.querySelector('#bookings-table tbody');
    bookingsTableBody.innerHTML = '<tr><td colspan="7">Loading bookings...</td></tr>';

    if (!authToken) {
        bookingsTableBody.innerHTML = '<tr><td colspan="7">Please log in to view bookings.</td></tr>';
        return;
    }

    try {
        const bookings = await fetchData(`${API_BASE_URL}/admin`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });

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

/**
 * Handles editing a booking.
 */
async function editBooking(id) {
    const editForm = document.getElementById('edit-form');
    const editIdInput = document.getElementById('edit-id');

    if (!authToken) {
        showMessage('Please log in to edit bookings.', 'error', 'edit-message');
        return;
    }

    try {
        const booking = await fetchData(`${API_BASE_URL}/${id}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });

        editIdInput.value = booking._id;
        document.getElementById('edit-service').value = booking.service;
        document.getElementById('edit-date').value = booking.date.split('T')[0];
        document.getElementById('edit-time').value = booking.time;
        document.getElementById('edit-name').value = booking.name;
        document.getElementById('edit-email').value = booking.email;

        document.getElementById('edit-booking-form').classList.remove('hidden');
        editForm.removeEventListener('submit', handleEditSubmit); // Avoid duplicate listeners
        editForm.addEventListener('submit', handleEditSubmit);

    } catch (error) {
        showMessage('Failed to fetch booking details for editing.', 'error', 'edit-message');
    }
}

/**
 * Handles the submission of the edit booking form.
 */
async function handleEditSubmit(event) {
    event.preventDefault();

    const editId = document.getElementById('edit-id').value;
    const updatedBookingData = {
        service: document.getElementById('edit-service').value,
        date: document.getElementById('edit-date').value,
        time: document.getElementById('edit-time').value,
        name: document.getElementById('edit-name').value,
        email: document.getElementById('edit-email').value,
    };

    if (!authToken) {
        showMessage('Please log in to update bookings.', 'error', 'edit-message');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${editId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(updatedBookingData),
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Booking updated successfully!', 'success', 'edit-message');
            document.getElementById('edit-booking-form').classList.add('hidden');
            fetchBookings();
        } else {
            showMessage(data.message || 'Failed to update booking.', 'error', 'edit-message');
        }
    } catch (error) {
        showMessage('Error updating booking. Please check your network.', 'error', 'edit-message');
    }
}

/**
 * Handles deleting a booking.
 */
async function deleteBooking(id) {
    if (!authToken) {
        showMessage('Please log in to delete bookings.', 'error', 'edit-message');
        return;
    }

    if (confirm('Are you sure you want to delete this booking?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
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
    const createForm = document.getElementById('create-form');

    if (!createService || !createDate || !createTime || !createName || !createEmail) {
        showMessage('Please fill in all fields.', 'error', 'create-message');
        return;
    }

    if (!authToken) {
        showMessage('Please log in to create bookings.', 'error', 'create-message');
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
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(newBookingData),
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
}

/**
 * Attaches event listeners to edit and delete buttons.
 */
function attachEventListenersToButtons() {
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', () => editBooking(button.getAttribute('data-id')));
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', () => deleteBooking(button.getAttribute('data-id')));
    });
}
