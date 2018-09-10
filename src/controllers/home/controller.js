const homePage = (req, res) => {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated())
        console.log(req.user);
    res.render('pages/home' , { userData: req.user });
}

const aboutPage = (req, res) => {
    //console.log(req);
    res.render('pages/about' , { userData: req.user });
}

export {
    homePage,
    aboutPage
}