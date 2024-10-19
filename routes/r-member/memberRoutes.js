const express = require('express');
const router = express.Router();
const memberController = require('../../controllers/c-member/memberController');

// Member routes
router.get('/manage-members', memberController.manageMembers);
router.get('/add-member', memberController.addMember);
router.get('/edit-member', memberController.editMember);

module.exports = router;
