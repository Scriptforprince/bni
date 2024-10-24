let apiUrl;
let allLinks = []; // To store fetched links globally
let filteredLinks = []; // To store filtered links based on search
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
    const response = await fetch('/api/universal-link-api'); // Call the backend to get the API URL
    const data = await response.json();
    apiUrl = data.apiUrl; // Store the API URL in apiUrl variable
    console.log('API URL fetched from backend:', apiUrl);
    await fetchLinks(); // Now fetch regions using the API URL
  } catch (error) {
    console.error('Error fetching the API URL:', error);
  }
}

// Function to fetch regions data
async function fetchLinks() {
  showLoader(); // Show the loader
  try {
    const response = await fetch(apiUrl); // Use the fetched apiUrl here
    if (!response.ok) throw new Error('Network response was not ok');

    allLinks = await response.json(); // Store fetched regions in the global variable
    filteredLinks = [...allLinks]; // Initialize filtered regions to all regions initially

    // Display the first page of regions
    displayRegions(filteredLinks.slice(0, entriesPerPage)); // Display only the first 10 entries
  } catch (error) {
    console.error('There was a problem fetching the links data:', error);
  } finally {
    hideLoader(); // Hide the loader when done
  }
}

// Function to display regions in the table
function displayRegions(regions) {
  const tableBody = document.getElementById('chaptersTableBody');

  // Clear existing rows
  tableBody.innerHTML = '';

  // Loop through the regions and create table rows
  regions.forEach((region, index) => {
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
        <span class="badge bg-${region.status === 'active' ? 'success' : 'danger'}">
          ${region.status}
        </span>
      </td>
    `;

    // Append the row to the table body
    tableBody.appendChild(row);
  });
}

// Function to filter regions based on search input
function filterRegions() {
  const searchValue = document.getElementById('searchChapterInput').value.toLowerCase();

  // Filter regions based on the search value
  filteredLinks = allLinks.filter(region => 
    region.region_name.toLowerCase().includes(searchValue)
  );

  // Display the filtered regions
  displayRegions(filteredLinks.slice(0, entriesPerPage)); // Display only the first entriesPerPage results
}

// Add event listener to the search input
document.getElementById('searchChapterInput').addEventListener('input', filterRegions);

// Call fetchApiUrl on page load to get the API URL first, then fetch regions
window.onload = fetchApiUrl;
