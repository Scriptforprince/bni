document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Fetch data from all necessary endpoints
        const [ordersResponse, transactionsResponse, chaptersResponse, paymentGatewayResponse] = await Promise.all([
            fetch("https://bni-data-backend.onrender.com/api/allOrders"),
            fetch("https://bni-data-backend.onrender.com/api/allTransactions"),
            fetch("https://bni-data-backend.onrender.com/api/chapters"),
            fetch("https://bni-data-backend.onrender.com/api/paymentGateway")
        ]);

        const orders = await ordersResponse.json();
        const transactions = await transactionsResponse.json();
        const chapters = await chaptersResponse.json();
        const paymentGateways = await paymentGatewayResponse.json();

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

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${formattedDate}</td>
                <td>${order?.member_name || "Unknown"}</td>
                <td><b><em>${chapterName}</em></b></td>
                <td><b>${formattedAmount}</b><br><a href="javascript:void(0);" class="fw-medium text-success">View</a></td>
                <td>${paymentImage} ${paymentMethod}</td>
                <td><em>${transaction.order_id}</em></td>
                <td><b><em>${transaction.cf_payment_id}</em></b></td>
                <td><span class="badge ${transaction.payment_status === 'SUCCESS' ? 'bg-success' : 'bg-danger'}">${transaction.payment_status.toLowerCase()}</span></td>
                <td><b><em>${gatewayName}</em></b></td>
                <td><em>Not Applicable</em></td>
                <td><em>Not Applicable</em></td>
                <td>
                    <a href="/t/new-invoice" class="btn btn-sm btn-success btn-wave waves-light">Generate E-Invoice</a>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Display the totals
        document.querySelector(".count-up[data-count='385']").textContent = `₹ ${totalTransactionAmount.toLocaleString("en-IN")}`;
        document.querySelectorAll(".count-up")[1].textContent = `₹ ${settledPayments.toLocaleString("en-IN")}`;
        document.querySelectorAll(".count-up")[2].textContent = `₹ ${pendingPayments.toLocaleString("en-IN")}`;
    } catch (error) {
        console.error("Error loading transactions:", error);
    }
});
