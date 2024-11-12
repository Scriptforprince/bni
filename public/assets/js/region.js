let apiUrl = 'https://bni-data-backend.onrender.com/api/regions'; // Default value
let allRegions = []; // To store fetched regions globally
let filteredRegions = []; // To store filtered regions based on search
let entriesPerPage = 10; // Number of entries to display per page
let currentPage = 1; // For pagination

// Function to show the loader
function showLoader() {
  document.getElementById('loader').style.display = 'flex'; // Show loader
}

// Function to hide the loader
function hideLoader() {
  document.getElementById('loader').style.display = 'none'; // Hide loader
}

// Fetch the API URL from the backend
async function fetchApiUrl() {
  try {
    const response = await fetch('https://bni-data-backend.onrender.com/api/regions'); // Call the backend to get the API URL
    const data = await response.json();
    apiUrl = data.apiUrl || apiUrl; // Update apiUrl if provided in the response
    console.log('API URL fetched from backend:', apiUrl);
  } catch (error) {
    console.error('Error fetching the API URL:', error);
  }
}

// Function to fetch regions data
async function fetchRegions() {
  try {
    const response = await fetch(apiUrl); // Use the fetched apiUrl here
    if (!response.ok) throw new Error('Network response was not ok');

    allRegions = await response.json(); // Store fetched regions in the global variable
    filteredRegions = [...allRegions]; // Initialize filtered regions to all regions initially

    // Display the first page of regions and hide the loader once the table is updated
    displayRegions(filteredRegions.slice(0, entriesPerPage)); // Display only the first 10 entries
  } catch (error) {
    console.error('There was a problem fetching the regions data:', error);
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
          <b>${region.region_name}</b>
        </div>
      </td>
      <td style="border: 1px solid grey;">
        <div class="d-flex align-items-center">
          <b>${region.region_headoffice_address || 'N/A'}</b>
        </div>
      </td>
      <td style="border: 1px solid grey;">
        <div class="d-flex align-items-center">
          <b>${region.days_of_chapter || 'N/A'}</b>
        </div>
      </td>
      <td style="border: 1px solid grey;">
        <span class="badge bg-${region.region_status === 'active' ? 'success' : 'danger'}">
          ${region.region_status}
        </span>
      </td>
        <td style="border: 1px solid grey">
        <span class="badge bg-warning text-light" style="cursor:pointer; color:white;">
           <a href="/r/edit-region/?region_id=${region.region_id} style="cursor:pointer; color:white;"">Edit</a>
        </span>
        <span class="badge bg-danger text-light"  style="cursor:pointer; color:white;">
         <a href="/r/view-region/?region_id=${region.region_id} style="cursor:pointer; color:white;"">Delete</a>
        </span>
      </td>
    `;

    // Append the row to the table body
    tableBody.appendChild(row);
  });

  // Hide the loader after the regions are displayed
  hideLoader();
}

// Function to filter regions based on search input
function filterRegions() {
  const searchValue = document.getElementById('searchChapterInput').value.toLowerCase();

  // Filter regions based on the search value
  filteredRegions = allRegions.filter(region => 
    region.region_name.toLowerCase().includes(searchValue)
  );

  // Display the filtered regions
  displayRegions(filteredRegions.slice(0, entriesPerPage)); // Display only the first entriesPerPage results
}

// Add event listener to the search input
document.getElementById('searchChapterInput').addEventListener('input', filterRegions);

window.addEventListener('DOMContentLoaded', async () => {
  showLoader(); // Show loader immediately on page load
  await fetchApiUrl(); // Fetch API URL first
  await fetchRegions(); // Then fetch regions after apiUrl is fetched
});
