// Function to show the loader
function showLoader() {
  document.getElementById('loader').style.display = 'flex'; // Show loader
}

// Function to hide the loader
function hideLoader() {
  document.getElementById('loader').style.display = 'none'; // Hide loader
}

(async function generateLedger() {
  // Fetch email from local storage
  const email = localStorage.getItem('loggedInEmail');

  if (!email) {
    alert('You are not logged in. Redirecting to login...');
    window.location.href = '/';
    return;
  }

  try {
    showLoader(); // Show loader

    // Fetch member data
    const memberResponse = await fetch('https://bni-data-backend.onrender.com/api/members');
    const members = await memberResponse.json();

    // Filter data for logged-in user
    const userData = members.find(member => member.member_email_address === email);

    if (!userData) {
      alert('No data found for the logged-in user.');
      return;
    }

    const { meeting_opening_balance, meeting_payable_amount } = userData;

    // Fetch orders and transactions
    const [ordersResponse, transactionsResponse] = await Promise.all([
      fetch('https://bni-data-backend.onrender.com/api/allOrders'),
      fetch('https://bni-data-backend.onrender.com/api/allTransactions'),
    ]);

    const orders = await ordersResponse.json();
    const transactions = await transactionsResponse.json();

    // Filter orders where universal_link_id = 4 and customer_email matches
    const filteredOrders = orders.filter(order =>
      order.universal_link_id === 4 && order.customer_email === email
    );

    // Filter transactions based on matching order_id and payment_status = "SUCCESS"
    const filteredTransactions = transactions.filter(transaction =>
      transaction.payment_status === 'SUCCESS' &&
      filteredOrders.some(order => order.order_id === transaction.order_id)
    );

    // Prepare ledger data
    let currentBalance = meeting_opening_balance;
    const ledgerData = [
      {
        sNo: 1,
        date: new Date().toLocaleDateString(),
        description: 'Opening Balance',
        debit: meeting_opening_balance,
        credit: 0,
        balance: (currentBalance -= meeting_opening_balance),
      },
      {
        sNo: 2,
        date: new Date().toLocaleDateString(),
        description: 'Meeting Payable Amount',
        debit: meeting_payable_amount,
        credit: 0,
        balance: (currentBalance -= meeting_payable_amount),
      },
    ];

    // Add filtered transaction details to the ledger (ignore orders, only show transactions)
    filteredTransactions.forEach(transaction => {
      ledgerData.push({
        sNo: ledgerData.length + 1,
        date: new Date(transaction.payment_time).toLocaleDateString(),
        description: 'Meeting Fee Paid',  // Updated description
        debit: 0,
        credit: transaction.payment_amount,
        balance: (currentBalance += parseFloat(transaction.payment_amount || 0)),
      });
    });

    // Populate table rows
    const ledgerBody = document.getElementById('ledger-body');
    ledgerBody.innerHTML = ''; // Clear existing rows
    ledgerData.forEach(entry => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${entry.sNo}</td>
        <td><b>${entry.date}</b></td>
        <td><b>${entry.description}</b></td>
        <td><b style="color: ${entry.debit ? 'red' : 'inherit'}">${entry.debit ? parseFloat(entry.debit).toFixed(2) : '-'}</b></td>
        <td><b style="color: ${entry.credit ? 'green' : 'inherit'}">${entry.credit ? parseFloat(entry.credit).toFixed(2) : '-'}</b></td>
        <td><b>${parseFloat(entry.balance).toFixed(2)}</b></td>
      `;
      ledgerBody.appendChild(row);
    });
    
  } catch (error) {
    console.error('Error generating ledger:', error);
    alert('An error occurred while generating the ledger.');
  } finally {
    hideLoader(); // Hide loader
  }
})();
