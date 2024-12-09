const urlParams = new URLSearchParams(window.location.search);
const training_id = urlParams.get('training_id'); // Get the accolade ID from the URL

// Function to show the loader
function showLoader() {
    document.getElementById('loader').style.display = 'flex'; // Show loader
  }
  
  // Function to hide the loader
  function hideLoader() {
    document.getElementById('loader').style.display = 'none'; // Hide loader
  }


// DOM elements for the form fields
const training_name = document.getElementById('training_name');
const training_venue = document.getElementById('training_venue');
const training_ticket_price = document.getElementById('training_ticket_price');
const training_date = document.getElementById('training_date');
const training_note = document.getElementById('training_note');
const training_published_by = document.getElementById('training_published_by');
const training_status = document.getElementById('training_status');

// Function to format date to YYYY-MM-DD for input[type="date"]
function formatDateForInput(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) return ''; // If the date is invalid, return an empty string
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }

// Function to fetch event details and populate the form
async function fetchTrainingDetails() {
  try {
    showLoader();
    const response = await fetch(`https://bni-data-backend.onrender.com/api/getTraining/${training_id}`);
    if (!response.ok) throw new Error('Failed to fetch event details');
    
    const trainingData = await response.json();

   // Populate the form fields with the fetched data
training_name.textContent = trainingData.training_name || '';
training_venue.textContent = trainingData.training_venue || '';
training_ticket_price.textContent = trainingData.training_price || '';
training_date.textContent = formatDateForInput(trainingData.training_date) || '';
training_note.textContent = trainingData.training_note || '';
training_published_by.textContent = trainingData.training_published_by || '';

// Set the "availability" span
training_status.textContent = trainingData.training_status || '';


  } catch (error) {
    console.error('Error fetching training details:', error);
  } finally {
    hideLoader();
  }
}

// Call the fetchTrainingDetails function on page load
window.addEventListener('load', fetchTrainingDetails);



// Function to collect form data and prepare it for the update
const collectFormData = () => {
    const trainingData = {
        training_name: document.querySelector("#training_name").value,
        training_venue: document.querySelector("#training_venue").value,
        training_price: document.querySelector("#training_ticket_price").value,
        training_date: document.querySelector("#training_date").value,
        training_note: document.querySelector("#training_note").value,
        training_published_by: document.querySelector("#training_published_by").value,
        training_status: document.querySelector("#training_status").value,
    };

    return trainingData;
};

