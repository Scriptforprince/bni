exports.manageTrainings = (req, res) => {
    res.render('m-training/manage-trainings', { title: 'Manage Trainings' });
};

exports.addTraining = (req, res) => {
    res.render('m-training/add-training', { title: 'Add Training' });
};

exports.editTraining = (req, res) => {
    res.render('m-training/edit-training', { title: 'Edit Training' });
};
