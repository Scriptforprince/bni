document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Fetch data from all necessary endpoints
        const [ordersResponse, transactionsResponse, chaptersResponse, paymentGatewayResponse, universalLinksResponse] = await Promise.all([
            fetch("https://bni-data-backend.onrender.com/api/allOrders"),
            fetch("https://bni-data-backend.onrender.com/api/allTransactions"),
            fetch("https://bni-data-backend.onrender.com/api/chapters"),
            fetch("https://bni-data-backend.onrender.com/api/paymentGateway"),
            fetch("https://bni-data-backend.onrender.com/api/universalLinks")
        ]);

        const orders = await ordersResponse.json();
        const transactions = await transactionsResponse.json();
        const chapters = await chaptersResponse.json();
        const paymentGateways = await paymentGatewayResponse.json();
        const universalLinks = await universalLinksResponse.json();

        // Map chapter names by chapter_id for quick access
        const chapterMap = new Map();
        chapters.forEach(chapter => {
            chapterMap.set(chapter.chapter_id, chapter.chapter_name);
        });

        // Map payment gateway names by gateway_id for quick access
        const paymentGatewayMap = new Map();
        paymentGateways.forEach(gateway => {
            paymentGatewayMap.set(gateway.gateway_id, gateway.gateway_name);
        });

        // Map universal link names by id for quick access
        const universalLinkMap = new Map();
        universalLinks.forEach(link => {
            universalLinkMap.set(link.id, link.universal_link_name);
        });

        // Initialize totals
        let totalTransactionAmount = 0;
        let settledPayments = 0;
        let pendingPayments = 0;

        // Sort transactions by payment time (latest first)
        transactions.sort((a, b) => new Date(b.payment_time) - new Date(a.payment_time));

        // Get the table body to insert rows
        const tableBody = document.querySelector(".table tbody");

        transactions.forEach((transaction, index) => {
            // Find the associated order
            const order = orders.find(order => order.order_id === transaction.order_id);

            // Get chapter name from chapterMap
            const chapterName = chapterMap.get(order?.chapter_id) || "N/A";

            // Get gateway name from paymentGatewayMap using order's gateway_id
            const gatewayName = paymentGatewayMap.get(order?.payment_gateway_id) || "Unknown";

            // Get universal link name from universalLinkMap using order's universal_link_id
            const universalLinkName = universalLinkMap.get(order?.universal_link_id) || "Not Applicable";

            // Update total transaction amount
            const transactionAmount = parseFloat(transaction.payment_amount);
            totalTransactionAmount += transactionAmount;

            // Check payment status and update settled or pending totals
            if (transaction.payment_status === 'SUCCESS') {
                settledPayments += transactionAmount;
            } else if (transaction.payment_status === 'PENDING') {
                pendingPayments += transactionAmount;
            }

            // Determine payment method
            let paymentMethod = "N/A";
            let paymentImage = "";
            if (transaction.payment_method) {
                if (transaction.payment_method.upi) {
                    paymentMethod = "UPI";
                    paymentImage = '<img src="https://economictimes.indiatimes.com/thumb/msid-74960608,width-1200,height-900,resizemode-4,imgsize-49172/upi-twitter.jpg?from=mdr" alt="UPI" width="30" height="30">';
                } else if (transaction.payment_method.card) {
                    paymentMethod = "Card";
                    paymentImage = '<img src="https://www.investopedia.com/thmb/F8CKM3YkF1fmnRCU2g4knuK0eDY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/MClogo-c823e495c5cf455c89ddfb0e17fc7978.jpg" alt="Card" width="20" height="20">';
                } else if (transaction.payment_method.netbanking) {
                    paymentMethod = "Net Banking";
                    paymentImage = '<img src="https://cdn.prod.website-files.com/64199d190fc7afa82666d89c/648b63af41676287e601542d_regular-bank-transfer.png" alt="Net Banking" width="20" height="20">';
                } else if (transaction.payment_method.wallet) {
                    paymentMethod = "Wallet";
                    paymentImage = '<img src="https://ibsintelligence.com/wp-content/uploads/2024/01/digital-wallet-application-mobile-internet-banking-online-payment-security-via-credit-card_228260-825.jpg" alt="Wallet" width="20" height="20">';
                }
            }

            // Format date and amount
            const formattedDate = new Date(transaction.payment_time).toLocaleDateString("en-GB");
            const formattedAmount = `+ ₹${transactionAmount.toLocaleString("en-IN")}`;

            // Create a new row for the table
            const row = document.createElement("tr");
            row.classList.add("invoice-list");

            const invoiceButton = transaction.payment_status === 'SUCCESS'
                ? `<a href="#" data-order-id="${order.order_id}" class="btn btn-sm btn-success btn-wave waves-light generate-invoice">Generate E-Invoice</a>`
                : `<em>Not Applicable</em>`;

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${formattedDate}</td>
                <td><img src="https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png" alt="Card" width="20" height="20">${order?.member_name || "Unknown"}</td>
                <td><b><em>${chapterName}</em></b></td>
                <td><b>${formattedAmount}</b><br><a href="/t/view-invoice?order_id=${transaction.order_id}" class="fw-medium text-success">View</a></td>
                <td>${paymentImage} ${paymentMethod}</td>
                <td><em>${transaction.order_id}</em></td>
                <td><b><em>${transaction.cf_payment_id}</em></b></td>
                <td><span class="badge ${transaction.payment_status === 'SUCCESS' ? 'bg-success' : 'bg-danger'}">${transaction.payment_status.toLowerCase()}</span></td>
                <td><b><em>${gatewayName}</em></b></td>
                <td><em>${universalLinkName}</em></td>
                <td class="irn"><em>Not Applicable</em></td>
                <td class="qrcode"><em>Not Applicable</em></td>
                <td>${invoiceButton}</td>
            `;

            tableBody.appendChild(row);

            // Fetch IRN and QR code details for each order from the einvoice table
            if (transaction.payment_status === 'SUCCESS') {
                fetch(`https://bni-data-backend.onrender.com/api/einvoice/${order.order_id}`)
                    .then(response => response.json())
                    .then(einvoiceData => {
                        const irnCell = row.querySelector(".irn");
                        const qrcodeCell = row.querySelector(".qrcode");
                        irnCell.innerHTML = einvoiceData.irn || "<em>Not Applicable</em>";
                        qrcodeCell.innerHTML = einvoiceData.qrcode 
                            ? `<img src="${einvoiceData.qrcode}" alt="QR Code" width="30" height="30">`
                            : "<em>Not Applicable</em>";
                    })
                    .catch(() => {
                        row.querySelector(".irn").innerHTML = "<em>Error Loading IRN</em>";
                        row.querySelector(".qrcode").innerHTML = "<em>Error Loading QR Code</em>";
                    });
            }

        });

        // Display the totals
        document.querySelector(".count-up[data-count='385']").textContent = `₹ ${totalTransactionAmount.toLocaleString("en-IN")}`;
        document.querySelectorAll(".count-up")[1].textContent = `₹ ${settledPayments.toLocaleString("en-IN")}`;
        document.querySelectorAll(".count-up")[2].textContent = `₹ ${pendingPayments.toLocaleString("en-IN")}`;

        document.addEventListener("click", (event) => {
            if (event.target.classList.contains("generate-invoice")) {
              event.preventDefault();
          
              // Get the order and transaction details, as in your original code
              const orderId = event.target.getAttribute("data-order-id");
              const order = orders.find(o => o.order_id === orderId);
              const transaction = transactions.find(t => t.order_id === orderId);
              const chapterName = chapterMap.get(order?.chapter_id) || "N/A";
              const gatewayName = paymentGatewayMap.get(order?.payment_gateway_id) || "Unknown";
              const universalLinkName = universalLinkMap.get(order?.universal_link_id) || "Not Applicable";
          
              // SweetAlert for confirmation, as in your original code
              Swal.fire({
                title: 'Are you sure?',
                text: `You are about to generate IRN and QR code for Order ID: ${orderId} and Transaction ID: ${transaction.cf_payment_id}.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Generate!',
                cancelButtonText: 'No, Cancel'
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire({
                    title: 'Please check the details',
                    html: `
                      <strong>Order ID:</strong> ${orderId}<br>
                      <strong>Transaction ID:</strong> ${transaction.cf_payment_id}<br>
                      <strong>Chapter Name:</strong> ${chapterName}<br>
                      <strong>Payment Gateway:</strong> ${gatewayName}<br>
                      <strong>Universal Link:</strong> ${universalLinkName}<br>
                      <strong>Amount:</strong> ₹ ${transaction.payment_amount}
                    `,
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonText: 'Confirm and Generate',
                    cancelButtonText: 'Cancel'
                  }).then(async (secondResult) => {
                    if (secondResult.isConfirmed) {
                      const invoiceData = {
                        orderId: order,
                        transactionId: transaction,
                        amount: transaction.payment_amount,
                        chapterName: chapterName,
                        gatewayName: gatewayName,
                        universalLinkName: universalLinkName,
                      };
          
                      try {
                        const backendResponse = await fetch("http://localhost:5000/einvoice/generate-irn", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(invoiceData),
                        });
          
                        const responseData = await backendResponse.json();
                        if (backendResponse.ok) {
                          // Success response handling
                          Swal.fire("Success", responseData.message, "success");

                          // Fetch IRN and QR code details after successful generation
                          const einvoiceResponse = await fetch(`https://bni-data-backend.onrender.com/api/einvoice/${orderId}`);
                                const einvoiceData = await einvoiceResponse.json();

                                const transactionRow = event.target.closest("tr");
                                transactionRow.querySelector(".irn").innerHTML = einvoiceData.irn || "<em>Not Applicable</em>";
                                transactionRow.querySelector(".qrcode").innerHTML = einvoiceData.qrcode
                                    ? `<img src="${einvoiceData.qrcode}" alt="QR Code" width="30" height="30">`
                                    : "<em>Not Applicable</em>";
                        } else {
                          // Error response handling
                          Swal.fire("Error", responseData.message, "error");
                        }
                      } catch (error) {
                        // Handle any fetch errors
                        Swal.fire("Error", "There was an issue connecting to the server. Please try again later.", "error");
                      }
                    }
                  });
                }
              });
            }
          });
          
    } catch (error) {
        console.error("Error loading data:", error);
    }
});