exports.manageChapter = (req, res) => {
    res.render('m-chapter/manage-chapter', { title: 'Chapter' });
};

exports.addChapter = (req, res) => {
    res.render('m-chapter/add-chapter', { title: 'addChapter' });
};
