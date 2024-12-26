exports.manageExpenses = (req, res) => {
    res.render('m-expense/manage-expense', { title: 'Manage Expenses' });
};

exports.addExpense = (req, res) => {
    res.render('m-expense/add-expense', { title: 'Add Expense' });
};



