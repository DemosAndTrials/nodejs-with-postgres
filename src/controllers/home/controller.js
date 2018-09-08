
const homePage = (req, res) => {
    console.log(req);
    res.render('pages/home');
}

const aboutPage = (req, res) => {
    console.log(req);
    res.render('pages/about');
}

export {
    homePage,
    aboutPage
}