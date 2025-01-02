// Function to show the loader
function showLoader() {
    document.getElementById('loader').style.display = 'flex'; // Show loader
  }
  
  // Function to hide the loader
  function hideLoader() {
    document.getElementById('loader').style.display = 'none'; // Hide loader
  }
  
  (async function fetchTransactions() {
    // Fetch email from local storage
    const email = localStorage.getItem('loggedInEmail');
  
    if (!email) {
      alert('You are not logged in. Redirecting to login...');
      window.location.href = '/';
      return;
    }
  
    try {
      showLoader(); // Show loader
  
      // Fetch orders and transactions
      const [ordersResponse, transactionsResponse] = await Promise.all([
        fetch('https://bni-data-backend.onrender.com/api/allOrders'),
        fetch('https://bni-data-backend.onrender.com/api/allTransactions'),
      ]);
  
      const orders = await ordersResponse.json();
      const transactions = await transactionsResponse.json();
  
      // Filter orders and transactions for the logged-in user (based on email)
      const filteredOrders = orders.filter(order => order.customer_email === email);
      const filteredTransactions = transactions.filter(transaction =>
        filteredOrders.some(order => order.order_id === transaction.order_id)
      );
  
      // Populate the transactions table
      const transactionsBody = document.querySelector('.member-all-transactions');
      transactionsBody.innerHTML = ''; // Clear existing rows
  
      filteredTransactions.forEach((transaction, index) => {
        const order = filteredOrders.find(order => order.order_id === transaction.order_id);
  
        // Create a new row for each transaction
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${index + 1}</td>
          <td><b>${new Date(transaction.payment_time).toLocaleDateString()}</b></td>
          <td><b>${parseFloat(transaction.payment_amount).toFixed(2)}</b></td>
          <td><b>${transaction.payment_group}</b></td>
          <td><b>${order.order_id}</b></td>
          <td><b>${transaction.transaction_id}</b></td>
          <td><b>${transaction.payment_status}</b></td>
          <td><b>${order.universal_link_id}</b></td>
        `;
        transactionsBody.appendChild(row);
      });
      
    } catch (error) {
      console.error('Error fetching transactions:', error);
      alert('An error occurred while fetching transactions.');
    } finally {
      hideLoader(); // Hide loader
    }
  })();
  