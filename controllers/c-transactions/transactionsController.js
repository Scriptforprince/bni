exports.manageTransactions = (req, res) => {
    res.render('m-transactions/manage-transactions', { title: 'Transactions' });
};

exports.addInvoice = (req, res) => {
    res.render('m-invoice/generate-invoice', { title: 'Invoice' });
};

exports.allTransactions = (req, res) => {
    res.render('m-transactions/all-transactions', { title: 'All Transactions' });
};

exports.viewInvoice = (req, res) => {
    res.render('m-transactions/view-transaction', { title: 'View Transactions' });
};