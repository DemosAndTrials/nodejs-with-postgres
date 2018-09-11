const homePage = (req, res) => {
    res.render('pages/home' , { userData: req.user });
}

const aboutPage = (req, res) => {
    res.render('pages/about' , { userData: req.user });
}

export {
    homePage,
    aboutPage
}