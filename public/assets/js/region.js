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

// Fetch regions with the applied filter
const fetchRegions = async (filter = 'ascending') => {
  try {
    const response = await fetch(`${apiUrl}`); // Make the request
    if (!response.ok) throw new Error('Network response was not ok');
    
    allRegions = await response.json(); // Store fetched regions in the global variable
    filteredRegions = [...allRegions]; // Initialize filtered regions to all regions initially

    // Sort based on the selected filter (ascending or descending)
    sortRegions(filter);

    // Display the sorted regions in the table
    displayRegions(filteredRegions.slice(0, entriesPerPage)); // Display only the first 10 entries
  } catch (error) {
    console.error('There was a problem fetching the regions data:', error);
  }
};

// Sort regions based on the selected filter
const sortRegions = (filter) => {
  if (filter === 'ascending') {
    filteredRegions.sort((a, b) => a.region_name.localeCompare(b.region_name)); // Sort ascending
  } else if (filter === 'descending') {
    filteredRegions.sort((a, b) => b.region_name.localeCompare(a.region_name)); // Sort descending
  }
};


const AddExpense = async () => {
  // Show confirmation using SweetAlert with an input field
  const result = await Swal.fire({
    title: 'Add Expense',
    text: "Please Expense Type.",
    icon: 'question',
    input: 'text',  // Specifies an input field for the user to type in
    inputPlaceholder: 'Enter the reason for the expense',
    showCancelButton: true,
    confirmButtonText: 'Submit',
    cancelButtonText: 'Cancel',
  });

 // Log the region_name passed to the function

  if (result.isConfirmed) {
    const inputValue = result.value; // Get the text input value
    // console.log("Input value:", inputValue); // Log the input value when submitted

    if (inputValue) {
      try {
        showLoader();  // Show loading indicator

        // Call the API to add the expense (replace with the actual API endpoint)
        const response = await fetch(`https://bni-data-backend.onrender.com/api/addExpense`, {
          method: 'POST',  // Use POST to add an expense
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ expense_name : inputValue }), // Send the reason as part of the request
        });

        if (response.ok) {
          const data = await response.json();
          Swal.fire('Success!', data.message, 'success');
        } else {
          const errorResponse = await response.json();
          Swal.fire('Failed!', errorResponse.message, 'error');
        }
      } catch (error) {
        console.error('Error adding expense:', error);
        Swal.fire('Error!', 'Failed to add expense. Please try again.', 'error');
      } finally {
        hideLoader();  // Hide loading indicator
      }
    } else {
      Swal.fire('Canceled', 'No reason entered.. Expense not added.', 'info');
    }
  }
};

document.getElementById('addNewExpenseBtn').addEventListener('click', (event) => {
  // Get the region_id from the button's data attribute
  const region_name = event.target.getAttribute('data-region-id');
  console.log("Region Name:", region_name); // Log the region name from button's data attribute
  // Call AddExpense function with the region_name
  AddExpense();
});
const deleteRegion = async (region_id) => {
  // Show confirmation using SweetAlert
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "This action will mark the region as deleted.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel'
  });

  if (result.isConfirmed) {
    try {
      showLoader();  // Show loading indicator
      const response = await fetch(`https://bni-data-backend.onrender.com/api/deleteRegion/${region_id}`, {
        method: 'PUT',
      });

      if (response.ok) {
        const data = await response.json();
        Swal.fire('Deleted!', data.message, 'success');
        // After deletion, remove the region from the table
        const rowToDelete = document.querySelector(`[data-region-id="${region_id}"]`).closest('tr');
        if (rowToDelete) rowToDelete.remove();
      } else {
        const errorResponse = await response.json();
        Swal.fire('Failed!', errorResponse.message, 'error');
      }
    } catch (error) {
      console.error('Error deleting region:', error);
      Swal.fire('Error!', 'Failed to delete region. Please try again.', 'error');
    } finally {
      hideLoader();  // Hide loading indicator
    }
  }
};

// Add event listener for delete buttons dynamically
document.getElementById('chaptersTableBody').addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-btn')) {
    const region_id = event.target.getAttribute('data-region-id');
    deleteRegion(region_id);
  }
});


// Add event listener for filter options
document.querySelectorAll('.filter-option').forEach((filterItem) => {
  filterItem.addEventListener('click', (event) => {
    const filter = event.target.getAttribute('data-filter'); // Get filter value from clicked item
    fetchRegions(filter); // Fetch regions with selected filter
    updateURLWithFilter(filter); // Update URL to reflect the applied filter
  });
});

// Function to update the URL with the selected filter
function updateURLWithFilter(filter) {
  const url = new URL(window.location); // Get the current page URL
  url.searchParams.set('filter', filter); // Set or update the 'filter' query parameter
  window.history.pushState({}, '', url); // Update the browser's URL without reloading the page
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
         <a href="/r/view-region/?region_id=${region.region_id}"> <b>${region.region_name}</b></a>
        </div>
      </td>
      <td style="border: 1px solid grey;"><b>${region.chaptersCount}</b></td>
      <td style="border: 1px solid grey;"><b>${region.membersCount}</b></td>
      <td style="border: 1px solid grey;">
        <div class="d-flex align-items-center">
          <b>${region.contact_number || 'N/A'}</b>
        </div>
      </td>
      <td style="border: 1px solid grey;">
        <span class="badge bg-${region.region_status === 'active' ? 'success' : 'danger'}">
          ${region.region_status}
        </span>
      </td>
      <td style="border: 1px solid grey">
        <span class="badge bg-primary text-light" style="cursor:pointer; color:white;">
           <a href="/" style="color:white">Edit</a>
        </span>
        <span class="badge bg-danger text-light delete-btn" style="cursor:pointer; color:white;" data-region-id="${region.region_id}">
     Delete
    </span>
      </td>
    `;

    // Append the row to the table body
    tableBody.appendChild(row);
  });

  // Hide the loader after the regions are displayed
  hideLoader();
}

// Initial fetch and sorting (default sort: ascending)
window.addEventListener('DOMContentLoaded', async () => {
  showLoader(); // Show loader immediately on page load
  await fetchRegions('ascending'); // Fetch regions with default ascending sort
});
