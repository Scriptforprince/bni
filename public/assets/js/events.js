const accoladesApiUrl = 'https://bni-data-backend.onrender.com/api/allEvents';
const accoladesTableBody = document.querySelector('table tbody');
const paginationContainer = document.querySelector('.pagination');
let accolades = []; // To store all fetched events
const eventsPerPage = 15; // Number of events per page
let currentPage = 1; // Current active page

// Function to show the loader
function showLoader() {
    document.getElementById('loader').style.display = 'flex';
}

// Function to hide the loader
function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

// Function to render the current page of events
function renderPage(page) {
    const startIndex = (page - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    const pageData = accolades.slice(startIndex, endIndex);

    accoladesTableBody.innerHTML = ''; // Clear the table

    if (pageData.length === 0) {
        accoladesTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger">No data available.</td>
            </tr>`;
        return;
    }

    pageData.forEach((accolade, index) => {
        const stockStatus = accolade.stock_available > 0 ? 'In Stock' : 'Out Of Stock';
        const stockStatusClass = accolade.stock_available > 0 ? 'bg-success-transparent' : 'bg-danger-transparent';
        const availabilityStatus = accolade.event_status === 'upcoming' ? 'Upcoming' : 'Completed';
        const availabilityClass = accolade.accolade_availability === 'available' ? 'bg-success-transparent' : 'bg-danger-transparent';
        const activeStatus = accolade.accolade_status === 'active' ? 'Active' : 'Inactive';
        const activeClass = accolade.accolade_status === 'active' ? 'bg-success-transparent' : 'bg-danger-transparent';

        accoladesTableBody.innerHTML += `
            <tr class="order-list">
                <td>${startIndex + index + 1}</td>
                <td>
                    <b>${accolade.event_name}</b>
                </td>
                <td>${accolade.event_venue || 'N/A'}</td>
                <td class="text-center"><b>${accolade.event_price}</b></td>
                <td>${new Date(accolade.event_date).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                }) || 'N/A'}</td>
                <td>
                    <span class="badge ${availabilityClass}">${availabilityStatus}</span>
                </td>
                <td>
                    <span class="badge bg-primary text-light">
                        <a href="/acc/edit-accolades/?accolade_id=${accolade.accolade_id}" style="color:white">Edit</a>
                    </span>
                    <span class="badge bg-danger text-light delete-btn" data-event-id="${accolade.event_id}">
                        Delete
                    </span>
                </td>
            </tr>`;
    });
}

// Function to render pagination controls
function renderPagination() {
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(accolades.length / eventsPerPage);

    const prevDisabled = currentPage === 1 ? 'disabled' : '';
    paginationContainer.innerHTML += `
        <li class="page-item ${prevDisabled}">
            <a class="page-link" href="javascript:void(0)" onclick="changePage(${currentPage - 1})">Previous</a>
        </li>`;

    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        paginationContainer.innerHTML += `
            <li class="page-item ${activeClass}">
                <a class="page-link" href="javascript:void(0)" onclick="changePage(${i})">${i}</a>
            </li>`;
    }

    const nextDisabled = currentPage === totalPages ? 'disabled' : '';
    paginationContainer.innerHTML += `
        <li class="page-item ${nextDisabled}">
            <a class="page-link" href="javascript:void(0)" onclick="changePage(${currentPage + 1})">Next</a>
        </li>`;
}

// Function to change page
function changePage(page) {
    if (page < 1 || page > Math.ceil(accolades.length / eventsPerPage)) return;

    currentPage = page;
    renderPage(currentPage);
    renderPagination();
}

// Function to fetch accolades data
async function fetchAndDisplayAccolades() {
    try {
        showLoader();

        const response = await fetch(accoladesApiUrl);
        if (!response.ok) throw new Error('Error fetching accolades data');

        accolades = await response.json();
        currentPage = 1; // Reset to first page after fetching new data
        renderPage(currentPage);
        renderPagination();
    } catch (error) {
        console.error('Error fetching accolades data:', error);
        accoladesTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger">Error fetching accolades data.</td>
            </tr>`;
    } finally {
        hideLoader();
    }
}

// Load accolades data on page load
window.addEventListener('load', fetchAndDisplayAccolades);

const deleteEvent = async (event_id) => {
    // Show confirmation using SweetAlert
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "This action will mark the event as deleted.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel'
    });
  
    if (result.isConfirmed) {
        try {
            showLoader();  // Show loading indicator
            const response = await fetch(`http://localhost:5000/api/deleteEvent/${event_id}`, {
                method: 'PUT',
            });
  
            if (response.ok) {
                const data = await response.json();
                Swal.fire('Deleted!', data.message, 'success');
                // After deletion, remove the accolade from the table
                document.querySelector(`[data-event-id="${event_id}"]`).closest('tr').remove();
            } else {
                const errorResponse = await response.json();
                Swal.fire('Failed!', errorResponse.message, 'error');
            }
        } catch (error) {
            console.error('Error deleting accolade:', error);
            Swal.fire('Error!', 'Failed to delete accolade. Please try again.', 'error');
        } finally {
            hideLoader();  // Hide loading indicator
        }
    }
  };
  
  // Add event listener for delete buttons dynamically
  document.getElementById('chaptersTableBody').addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
      const event_id = event.target.getAttribute('data-event-id');
      deleteEvent(event_id);
    }
  });



