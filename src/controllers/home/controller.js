const homePage = (req, res) => {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated())
        console.log(req.user);
    res.render('pages/home' , { userData: req.user, name:'test50' });
}

const aboutPage = (req, res) => {
    res.render('pages/about' , { userData: req.user });
}

export {
    homePage,
    aboutPage
}