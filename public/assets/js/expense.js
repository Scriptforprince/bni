let apiUrl = 'https://bni-data-backend.onrender.com/api/allExpenses'; // API for expenses
let allExpenses = []; // To store fetched expenses globally
let filteredExpenses = []; // To store filtered expenses based on search
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

// Fetch expenses with the applied filter
const fetchExpenses = async (filter = 'ascending') => {
    try {
        const response = await fetch(`${apiUrl}`); // Make the request
        if (!response.ok) throw new Error('Network response was not ok');

        allExpenses = await response.json(); // Store fetched expenses in the global variable
        filteredExpenses = [...allExpenses]; // Initialize filtered expenses to all expenses initially

        // Sort based on the selected filter (ascending or descending)
        sortExpenses(filter);

        // Display the sorted expenses in the table
        displayExpenses(filteredExpenses.slice(0, entriesPerPage)); // Display only the first 10 entries
    } catch (error) {
        console.error('There was a problem fetching the expenses data:', error);
    }
};

// Sort expenses based on the selected filter
const sortExpenses = (filter) => {
    // Sort expenses by bill_date (ascending or descending)
    if (filter === 'ascending') {
        filteredExpenses.sort((a, b) => new Date(a.bill_date) - new Date(b.bill_date)); // Sort by bill_date ascending
    } else if (filter === 'descending') {
        filteredExpenses.sort((a, b) => new Date(b.bill_date) - new Date(a.bill_date)); // Sort by bill_date descending
    }
};

const AddExpenseType = async () => {
    // Show confirmation using SweetAlert with an input field and dropdown
    const result = await Swal.fire({
      title: 'Add Expense',
      html: `
        <label for="expenseType">Expense Type:</label>
        <input id="expenseType" class="swal2-input" placeholder="Enter the Expense Type for the expense">
        </br>
        <label for="status">Status:</label>
        <select id="status" class="swal2-input">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      focusConfirm: false,
      preConfirm: () => {
        const expenseType = document.getElementById('expenseType').value;
        const status = document.getElementById('status').value;
  
        if (!expenseType) {
          Swal.showValidationMessage('Expense Type is required');
          return null;
        }
        return { expenseType, status };
      }
    });
  
    if (result.isConfirmed) {
      const { expenseType, status } = result.value; // Extract the values
  
      if (expenseType) {
        try {
          showLoader(); // Show loading indicator
  
          // Call the API to add the expense (replace with the actual API endpoint)
          const response = await fetch(`http://localhost:5000/api/expenseType`, {
            method: 'POST', // Use POST to add an expense
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ expense_name: expenseType, expense_status:status }), // Send the expense name and status
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
          hideLoader(); // Hide loading indicator
        }
      } else {
        Swal.fire('Canceled', 'No expense type entered. Expense not added.', 'info');
      }
    }
  };
  
document.getElementById('addNewExpenseBtn').addEventListener('click', (event) => {
  // Get the region_id from the button's data attribute
  const region_name = event.target.getAttribute('data-region-id');
  console.log("Region Name:", region_name); // Log the region name from button's data attribute
  // Call AddExpense function with the region_name
  AddExpenseType();
});
// Function to display expenses in the table
function displayExpenses(expenses) {
    const tableBody = document.getElementById('expensesTableBody');

    // Clear existing rows
    tableBody.innerHTML = '';

    // Loop through the expenses and create table rows
    expenses.forEach((expense, index) => {
        const row = document.createElement('tr');
        row.classList.add('order-list');

        // Format the date (bill_date) into a readable format
        const billDate = new Date(expense.bill_date);
        const formattedBillDate = billDate.toLocaleDateString(); // Format as per locale (e.g., MM/DD/YYYY)

        // Add table cells with expense data
        row.innerHTML = `
            <td>${(currentPage - 1) * entriesPerPage + index + 1}</td>
            <td style="border: 1px solid grey;"><b>Expense Type ${expense.expense_type}</b></td>
            <td style="border: 1px solid grey;"><b>${expense.submitted_by}</b></td>
            <td style="border: 1px solid grey;"><b>${expense.description}</b></td>
            <td style="border: 1px solid grey;"><b>₹ ${expense.amount}</b></td>
            <td style="border: 1px solid grey;">
                <span class="badge bg-${expense.payment_status === 'pending' ? 'warning' : 'success'}">${expense.payment_status}</span>
            </td>
            <td style="border: 1px solid grey;"><b>${formattedBillDate}</b></td>
            <td style="border: 1px solid grey">
                <a href="/exp/edit-expense/?expense_id=${expense.expense_id}" target="_blank" class="badge bg-primary text-light">View Bill</a>
                <span class="badge bg-danger text-light delete-btn" style="cursor:pointer; color:white;" data-expense-id="${expense.expense_id}">Delete</span>
            </td>
        `;

        // Append the row to the table body
        tableBody.appendChild(row);
    });

    // Hide the loader after expenses are displayed
    hideLoader();
}

// Event listener for Delete button
document.getElementById('expensesTableBody').addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const expenseId = event.target.getAttribute('data-expense-id');
        deleteExpense(expenseId);
    }
});

// Function to delete an expense
const deleteExpense = async (expense_id) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "This action will delete the expense.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel',
    });

    if (result.isConfirmed) {
        try {
            showLoader(); // Show loading indicator

            const response = await fetch(`http://localhost:5000/api/expense/${expense_id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                Swal.fire('Deleted!', 'Expense has been deleted.', 'success');
                // After deletion, remove the row from the table
                const rowToDelete = document.querySelector(`tr[data-expense-id="${expense_id}"]`);
                if (rowToDelete) rowToDelete.remove();
            } else {
                Swal.fire('Failed!', 'Failed to delete the expense.', 'error');
            }

        } catch (error) {
            console.error('Error deleting expense:', error);
            Swal.fire('Error!', 'An error occurred while deleting the expense.', 'error');
        } finally {
            hideLoader(); // Hide loading indicator
        }
    }
};

// Event listener for sort button
document.getElementById('sortButton').addEventListener('click', () => {
    // Toggle the sort order based on the current state
    const currentSort = document.getElementById('sortButton').getAttribute('data-sort') || 'ascending';
    const newSort = currentSort === 'ascending' ? 'descending' : 'ascending';

    // Set the new sort state
    document.getElementById('sortButton').setAttribute('data-sort', newSort);

    // Show loader while fetching and sorting
    showLoader();

    // Fetch expenses with the selected sorting order
    fetchExpenses(newSort);
});

// Initial fetch and sorting (default sort: ascending)
window.addEventListener('DOMContentLoaded', async () => {
    showLoader(); // Show loader immediately on page load
    await fetchExpenses('ascending'); // Fetch expenses with default ascending sort
});
