let apiUrl;
let allLinks = []; // To store fetched links globally
let filteredLinks = []; // To store filtered links based on search
let paymentGateways = []; // To store fetched payment gateways globally
let entriesPerPage = 10; // Number of entries to display per page
let currentPage = 1; // For pagination

// Show the loader
function showLoader() {
  const loader = document.getElementById('loader');
  loader.style.display = 'flex';
}

// Hide the loader
function hideLoader() {
  const loader = document.getElementById('loader');
  loader.style.display = 'none';
}

// Fetch the API URL from the backend
async function fetchApiUrl() {
  try {
    const response = await fetch('/api/universal-link-api');
    const data = await response.json();
    apiUrl = data.apiUrl; // Store the API URL in apiUrl variable
    await fetchLinks(); // Now fetch links using the API URL
  } catch (error) {
    console.error('Error fetching the API URL:', error);
  }
}

// Function to fetch payment gateways
async function fetchPaymentGateways() {
  try {
    const response = await fetch('https://bni-data-backend.onrender.com/api/paymentGateway');
    if (!response.ok) throw new Error('Network response was not ok');
    paymentGateways = await response.json();
    
    // Log the payment gateways
  } catch (error) {
    console.error('Error fetching payment gateways:', error);
  }
}

// Function to fetch links data
async function fetchLinks() {
  showLoader(); // Show the loader
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Network response was not ok');

    allLinks = await response.json(); // Store fetched links in the global variable
    filteredLinks = [...allLinks]; // Initialize filtered links to all links initially

    // Display the first page of links
    displayLinks(filteredLinks.slice(0, entriesPerPage)); // Display only the first entriesPerPage
  } catch (error) {
    console.error('There was a problem fetching the links data:', error);
  } finally {
    hideLoader(); // Hide the loader when done
  }
}

// Function to display links in the table
function displayLinks(regions) {
  const tableBody = document.getElementById('chaptersTableBody');

  // Clear existing rows
  tableBody.innerHTML = '';

  // Loop through the regions and create table rows
  regions.forEach((region, index) => {
    
    // Find the payment gateway name
    const paymentGateway = paymentGateways.find(pg => {
      return pg.gateway_id.toString() === region.payment_gateway.toString(); 
    });
    
    // Get the payment gateway name or default to 'N/A'
    const paymentGatewayName = paymentGateway ? paymentGateway.gateway_name : 'N/A'; 

    const row = document.createElement('tr');
    row.classList.add('order-list');

    // Add table cells with region data
    row.innerHTML = `
      <td>${(currentPage - 1) * entriesPerPage + index + 1}</td>
      <td style="border: 1px solid grey;">
        <div class="d-flex align-items-center">
          <b>${region.universal_link_name}</b>
        </div>
      </td>
      <td style="border: 1px solid grey;">
        <div class="d-flex align-items-center">
          <b>${region.ulid || 'N/A'}</b>
        </div>
      </td>
      <td style="border: 1px solid grey;">
        <div class="d-flex align-items-center">
          <b>${region.link_slug || 'N/A'}</b>
        </div>
      </td>
      <td style="border: 1px solid grey;">
        <div class="d-flex align-items-center">
          <em><u>${paymentGatewayName}</u></em>
        </div>
      </td>
      <td style="border: 1px solid grey;">
        <span class="badge bg-${region.status === 'active' ? 'success' : 'danger'}">
          ${region.status}
        </span>
      </td>
    `;

    // Append the row to the table body
    tableBody.appendChild(row);
  });
}

// Function to filter links based on search input
function filterRegions() {
  const searchValue = document.getElementById('searchChapterInput').value.toLowerCase();

  // Filter regions based on the search value
  filteredLinks = allLinks.filter(region => 
    region.universal_link_name.toLowerCase().includes(searchValue)
  );

  // Display the filtered regions
  displayLinks(filteredLinks.slice(0, entriesPerPage));
}

// Add event listener to the search input
document.getElementById('searchChapterInput').addEventListener('input', filterRegions);

// Call fetchApiUrl and fetchPaymentGateways on page load
window.onload = async () => {
  await fetchPaymentGateways(); // Fetch payment gateways first
  await fetchApiUrl(); // Then fetch the API URL
};
