const express = require('express');
const router = express.Router();
const expenseController = require('../../controllers/c-expense/expensesController');

// Events routes
router.get('/manage-expenses', expenseController.manageExpenses);
router.get('/add-expenses', expenseController.addExpense);

module.exports = router;
