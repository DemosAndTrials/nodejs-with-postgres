import FuelSdkService from '../../services/FuelSdkService';

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
const deFoldersPage = async (req, res) => {

    var data_folders = await FuelSdkService.getFolders();

    var parentFolder = data_folders.find(function (folder) {
        return folder.ParentFolder.ID == '0';
    });

    var data_extensions = await FuelSdkService.getDataExtensions(parentFolder.ID);

    res.render('pages/api/sdk/de-folders', {
        userData: req.user,
        data_folders: data_folders,
        data_extensions: data_extensions,
        selectedFolderId: parentFolder.ID,
        parentFolderId: ''
    });
}

/**
 * Get data extensions for specific folder
 */
const deFolderPage = async (req, res) => {
    const folderId = req.params.id;

    try {

        var data_folders = await FuelSdkService.getFolders();
        var data_extensions = await FuelSdkService.getDataExtensions(folderId);

        res.render('pages/api/sdk/de-folders', {
            userData: req.user,
            data_folders: data_folders,
            data_extensions: data_extensions,
            selectedFolderId: folderId,
            parentFolderId: ''
        });
    } catch (err) {
        console.log('err: ' + err);
        res.redirect('/500');
    }
}

/**
 * Get data extensions for specific folder
 */
const deleteDE = async (req, res) => {
    const deId = req.params.id;
    //console.log('deId: ' + deId);
    var result = await FuelSdkService.deleteDataExtension(deId);
    return res.status(200).json({
        success: true,
        result
    });
}

/**
 * Create data extensions
 */
const createDEPage = async (req, res) => {
    const folderId = req.params.id;
    //console.log('deId: ' + deId);
    res.render('pages/api/sdk/de-create', {
        userData: req.user,
        folderId: folderId
    });
}

/**
 * Create data extension folder
 */
const createFolder = async (req, res) => {
    const folder = req.body;
    console.log('body: ' + JSON.stringify(folder));
    var result = await FuelSdkService.createFolder(folder);
    return res.status(200).json({
        success: true,
        result
    });
}

export {
    indexPage,
    sdkPage,
    restPage,
    soapPage,
    deFoldersPage,
    deFolderPage,
    deleteDE,
    createFolder,
    createDEPage
}