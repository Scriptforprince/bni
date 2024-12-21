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
    showLoader();  // Show loader
    // Fetch member data
    const response = await fetch('https://bni-data-backend.onrender.com/api/members');
    const members = await response.json();

    // Filter data for logged-in user
    const userData = members.find(member => member.member_email_address === email);

    if (!userData) {
      alert('No data found for the logged-in user.');
      return;
    }

    // Extract relevant fields
    const { meeting_opening_balance, meeting_payable_amount } = userData;

    // Initialize the balance with the opening balance
    let currentBalance = meeting_opening_balance;

    // Define ledger data
    const ledgerData = [
      {
        sNo: 1,
        date: new Date().toLocaleDateString(),
        description: 'Opening Balance (Credit)',
        amount: `+${meeting_opening_balance}`,
        balance: currentBalance,
      },
      {
        sNo: 2,
        date: new Date().toLocaleDateString(),
        description: 'Meeting Payable Amount (Debit)',
        amount: `+${meeting_payable_amount}`,
        balance: currentBalance + meeting_payable_amount,
      },
    ];

    // Populate table rows
    const ledgerBody = document.getElementById('ledger-body');
    ledgerData.forEach(entry => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${entry.sNo}</td>
        <td><b>${entry.date}</b></td>
        <td><b>${entry.description}</b></td>
        <td><b>${entry.amount}</b></td>
        <td><b>${entry.balance}</b></td>
      `;
      ledgerBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching member data:', error);
    alert('An error occurred while fetching the ledger.');
  } finally {
    hideLoader();
  }
})();

async function fetchMemberDataAndCalculateKittyAmount() {
  try {
    showLoader(); // Show loader while data is being fetched

    // Fetch logged-in email from local storage
    const email = localStorage.getItem('loggedInEmail');

    if (!email) {
      throw new Error('User email not found in local storage.');
    }

    // Fetch member data from the API
    const response = await fetch('https://bni-data-backend.onrender.com/api/members');
    const members = await response.json();

    if (!Array.isArray(members)) {
      throw new Error('Invalid response from the API.');
    }

    // Find the logged-in user's data
    const member = members.find(m => m.member_email_address === email);

    if (!member) {
      throw new Error('Member data not found.');
    }

    // Calculate the total kitty amount
    const meetingOpeningBalance = member.meeting_opening_balance || 0;
    const meetingPayableAmount = member.meeting_payable_amount || 0;
    const totalKittyAmount = meetingOpeningBalance + meetingPayableAmount;

    // Update the total kitty amount in the UI
    document.getElementById('total-kitty-amount').textContent = totalKittyAmount;

  } catch (error) {
    console.error('Error fetching member data or calculating kitty amount:', error);
    alert('Failed to load kitty amount. Please try again later.');
  } finally {
    hideLoader(); // Hide loader after operation
  }
}

// Call the function to load data and calculate the total kitty amount
fetchMemberDataAndCalculateKittyAmount();

