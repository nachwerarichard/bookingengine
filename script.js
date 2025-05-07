async function submitBooking() {
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const messageDiv = document.getElementById('message');

    const bookingData = {
        service,
        date,
        time,
        name,
        email
    };

    try {
        const response = await fetch('https://bookingenginebackend.onrender.com/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        const data = await response.json();

        if (response.ok) {
            messageDiv.className = 'success';
            messageDiv.textContent = data.message;
            messageDiv.classList.remove('hidden');
            fetchAvailability(); // Refresh availability after booking
            document.querySelector('.booking-form').reset(); // Clear the form
            setTimeout(() => {
                messageDiv.classList.add('hidden');
            }, 3000);
        } else {
            messageDiv.className = 'error';
            messageDiv.textContent = data.error || 'An error occurred.';
            messageDiv.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error submitting booking:', error);
        messageDiv.className = 'error';
        messageDiv.textContent = 'Failed to submit booking.';
        messageDiv.classList.remove('hidden');
    }
}

async function fetchAvailabilit() {
    const availabilityList = document.getElementById('availability-list');
    availabilityList.innerHTML = '<li>Loading availability...</li>'; // Initial loading message

    try {
        const response = await fetch('https://bookingenginebackend.onrender.com/api/bookings/availability');
        const data = await response.json();

        if (response.ok && data.availability && data.availability.length > 0) {
            availabilityList.innerHTML = ''; // Clear loading message
            data.availability.forEach(item => {
                const listItem = document.createElement('li');
                listItem.textContent = `${item.service} on ${new Date(item.date).toLocaleDateString()} at ${item.time} is booked by ${item.name} (${item.email})`;
                availabilityList.appendChild(listItem);
            });
        } else {
            availabilityList.innerHTML = '<li>No bookings yet.</li>';
        }
    } catch (error) {
        console.error('Error fetching availability:', error);
        availabilityList.innerHTML = '<li>Failed to load availability.</li>';
    }

    function checkAvailability() {
    const date = document.getElementById('check-date').value;
    const time = document.getElementById('check-time').value;
    const messageDiv = document.getElementById('availability-message');

    if (date && time) {
        // Simulate availability check (replace with real logic or API)
        messageDiv.innerHTML = `<p style="color: green;">Slot available for ${date} at ${time}!</p>`;

        // Show booking form and hide check availability form
        document.getElementById('booking-form').classList.remove('hidden');
        document.getElementById('book-now-title').classList.remove('hidden');
        document.getElementById('availability-form').classList.add('hidden');

        // Auto-fill the date and time in booking form
        document.getElementById('date').value = date;
        document.getElementById('time').value = time;
    } else {
        messageDiv.innerHTML = `<p style="color: red;">Please select both date and time.</p>`;
    }
}

function submitBooking() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    if (name && email) {
        document.getElementById('message').classList.remove('hidden');
        document.getElementById('message').innerHTML = `<p style="color: green;">Booking confirmed for ${name}!</p>`;
    } else {
        document.getElementById('message').classList.remove('hidden');
        document.getElementById('message').innerHTML = `<p style="color: red;">Please fill out all required fields.</p>`;
    }
}



// Fetch initial availability when the page loads
document.addEventListener('DOMContentLoaded', fetchAvailability);
