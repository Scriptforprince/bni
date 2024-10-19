exports.manageMembers = (req, res) => {
    res.render('m-member/manage-members', { title: 'Member' });
};

exports.addMember = (req, res) => {
    res.render('m-member/add-member', { title: 'addMember' });
};

exports.editMember = (req, res) => {
    res.render('m-member/edit-members', { title: 'editMember' });
};
