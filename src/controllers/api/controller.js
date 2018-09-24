
/**
 * Index page
 */
const indexPage = (req, res) => {
    res.render('pages/api/index', {
        userData: req.user
    });
}

/**
 * SDK page
 */
const sdkPage = (req, res) => {
    res.render('pages/api/sdk', {
        userData: req.user
    });
}

/**
 * REST API page
 */
const restPage = (req, res) => {
    res.render('pages/api/rest', {
        userData: req.user
    });
}

/**
 * SOAP API page
 */
const soapPage = (req, res) => {
    res.render('pages/api/soap', {
        userData: req.user
    });
}

/**
 * Data extensions general page
 * - Folders and list of data extensions
 */
const deFoldersPage = (req, res) => {
    res.render('pages/api/sdk/de-folders', {
        userData: req.user
    });
}

/**
 * Get data extensions for specific folder
 */
const deFolderPage = (req, res) => {
    const id = req.params.id;
    res.render('pages/api/sdk/de-folders', {
        userData: req.user
    });
}

/**
 * Get data extensions for specific folder
 */
const deListPage = (req, res) => {
    res.render('pages/api/sdk/de-list', {
        userData: req.user
    });
}

export {
    indexPage,
    sdkPage,
    restPage,
    soapPage,
    deFoldersPage
}