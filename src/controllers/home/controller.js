
const homePage = (req, res) => {
    console.log(req);
    //res.render('pages/home');
    res.render('pages/home', {
        url: req.url
    })
}

const aboutPage = (req, res) => {
    console.log(req);
    res.render('pages/about');
}

export {
    homePage,
    aboutPage
}