exports.manageEvents = (req, res) => {
    res.render('m-events/manage-events', { title: 'Manage Events' });
};

exports.addEvent = (req, res) => {
    res.render('m-events/add-event', { title: 'Add Event' });
};


