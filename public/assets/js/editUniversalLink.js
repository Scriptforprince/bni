// Function to show the loader
function showLoader() {
    document.getElementById("loader").style.display = "flex";
  }
  
  // Function to hide the loader
  function hideLoader() {
    document.getElementById("loader").style.display = "none";
  }


document.addEventListener('DOMContentLoaded', async function () {
    // Get the universal link ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const universalLinkId = urlParams.get('id');

    if (!universalLinkId) {
        alert('No universal link ID provided!');
        return;
    }

    try {
        showLoader();
        // Fetch the universal link details
        const response = await fetch(`https://bni-data-backend.onrender.com/api/getUniversalLink/${universalLinkId}`);
        if (!response.ok) throw new Error('Error fetching universal link details');
        
        const universalLink = await response.json();

        const gatewayResponse = await fetch('https://bni-data-backend.onrender.com/api/paymentGateway');
        if (!gatewayResponse.ok) throw new Error('Error fetching payment gateways');
        const paymentGateways = await gatewayResponse.json();

        // Populate the form fields
        document.getElementById('link_name').value = universalLink.universal_link_name || '';
        document.getElementById('link_ulid').value = universalLink.ulid || '';
        document.getElementById('link_slug').value = universalLink.link_slug || '';

         // Configure status dropdown
         const statusDropdown = document.getElementById('link_status');
         statusDropdown.innerHTML = `
             <option value="active" ${universalLink.status === 'active' ? 'selected' : ''}>Active</option>
             <option value="inactive" ${universalLink.status === 'inactive' ? 'selected' : ''}>Inactive</option>
         `;

         

        // Populate payment gateway dropdown
        const paymentGatewaySelect = document.getElementById('link_payment_gateway');
        paymentGateways.forEach(gateway => {
            const option = document.createElement('option');
            option.value = gateway.gateway_id;
            option.textContent = gateway.gateway_name; // Assuming `name` exists in the payment gateway data
            if (gateway.gateway_id === universalLink.payment_gateway) {
                option.selected = true; // Auto-select the current payment gateway
            }
            paymentGatewaySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching universal link:', error);
        alert('Failed to fetch universal link details. Please try again.');
    }
});
