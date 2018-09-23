
/**
 * Index page
 */
const indexPage = (req, res) => {
    res.render('pages/api/index', {
        userData: req.user
    });
}

export {
    indexPage
}