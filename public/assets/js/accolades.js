// API URL to fetch accolades data
const accoladesApiUrl = 'https://bni-data-backend.onrender.com/api/accolades';
const searchInput = document.getElementById('searchAccolades');

// DOM element to populate the accolades table
const accoladesTableBody = document.querySelector('table tbody');

// Function to show the loader
function showLoader() {
    document.getElementById('loader').style.display = 'flex'; // Show loader
  }
  
  // Function to hide the loader
  function hideLoader() {
    document.getElementById('loader').style.display = 'none'; // Hide loader
  }

// Function to fetch and display accolades
async function fetchAndDisplayAccolades() {
  try {
    showLoader();

    // Fetch accolades data from the API
    const response = await fetch(accoladesApiUrl);
    if (!response.ok) throw new Error('Error fetching accolades data');

    const accolades = await response.json();

    // Clear the table body
    accoladesTableBody.innerHTML = '';

    // Loop through accolades and populate the table
    accolades.forEach((accolade, index) => {
      const stockStatus = accolade.stock_available > 0 ? 'In Stock' : 'Out Of Stock';
      const statusClass = accolade.stock_available > 0 ? 'bg-success-transparent' : 'bg-danger-transparent';
      const activeStatus = accolade.is_active ? 'Active' : 'Inactive';
      const activeClass = accolade.is_active ? 'bg-success-transparent' : 'bg-danger-transparent';

      accoladesTableBody.innerHTML += `
        <tr class="order-list">
          <td>${index + 1}</td>
          <td>
            <div class="d-flex align-items-center">
              <div class="ms-2">
                <p class="fw-semibold mb-0 d-flex align-items-center">
                  <a href="#">${accolade.accolade_name}</a>
                </p>
              </div>
            </div>
          </td>
          <td>
            <div class="d-flex align-items-center">
              <div class="ms-2">
                <p class="fw-semibold mb-0 d-flex align-items-center">
                  <a href="#">${accolade.accolade_published_by || 'N/A'}</a>
                </p>
              </div>
            </div>
          </td>
          <td class="text-center">${accolade.stock_available}</td>
          <td class="fw-semibold">${new Date(accolade.accolade_publish_date).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }) || 'N/A'}</td>
          <td>
            <span class="badge ${statusClass}">${stockStatus}</span>
          </td>
          <td>
            <span class="badge ${activeClass}">${activeStatus}</span>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    console.error('Error fetching accolades data:', error);
    accoladesTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-danger">Error fetching accolades data.</td>
      </tr>
    `;
  } finally {
    hideLoader();
  }
}


// Function to filter accolades based on search query
function filterAccolades() {
    const query = searchInput.value.toLowerCase(); // Get the search query in lowercase
    const rows = accoladesTableBody.querySelectorAll('tr'); // Select all rows in the table
  
    rows.forEach((row) => {
      const accoladeName = row.querySelector('td:nth-child(2) a')?.textContent.toLowerCase(); // Get the accolade name text
      const publishedBy = row.querySelector('td:nth-child(3) a')?.textContent.toLowerCase(); // Get the published by text
  
      // Check if either accolade name or published by matches the search query
      if (accoladeName?.includes(query) || publishedBy?.includes(query)) {
        row.style.display = ''; // Show the row if it matches
      } else {
        row.style.display = 'none'; // Hide the row if it doesn't match
      }
    });
  }

  searchInput.addEventListener('input', filterAccolades);

// Call the function on page load
window.addEventListener('load', fetchAndDisplayAccolades);
