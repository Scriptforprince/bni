const express = require('express');
const router = express.Router();
const expenseController = require('../../controllers/c-expense/expensesController');

// Events routes
router.get('/manage-expenses', expenseController.manageExpenses);
router.get('/add-expenses', expenseController.addExpense);
router.get('/edit-expense/', expenseController.editExpense)
module.exports = router;
