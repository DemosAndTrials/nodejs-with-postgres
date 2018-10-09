import FuelSdkService from '../../services/FuelSdkService';
import DataExtension from '../../models/api/dataExtension';

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
 * Data extensions details
 */
const detailsDEPage = async (req, res) => {
    const objectID = req.params.id;
    var de = await FuelSdkService.getDataExtension(objectID);
    var cols = await FuelSdkService.getDataExtensionColumns(de.CustomerKey)
    var canDeleteRow = cols.filter(c => c.IsPrimaryKey === 'true').length > 0;
    var colNames = cols.map(a => a.Name);
    var rows = await FuelSdkService.getDataExtensionRows(de.CustomerKey, colNames);

    res.render('pages/api/sdk/de-details', {
        userData: req.user,
        de: de,
        rows: rows ? rows : [], // ???
        cols: cols,
        canDeleteRow: canDeleteRow
    });
}

/**
 * Get data extensions for specific folder
 */
const deleteDE = async (req, res) => {
    const deId = req.params.id;
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
    var de = new DataExtension();
    res.render('pages/api/sdk/de-create', {
        userData: req.user,
        folderId: folderId,
        de: de,
        errors: []
    });
}

/**
 * Create data extensions
 */
const createDE = async (req, res) => {
    const folderId = req.params.folderId;
    var de = req.body.de;
    de.CategoryID = folderId;
    var result = await FuelSdkService.createDataExtension(de);
    res.render('pages/api/sdk/de-create', {
        userData: req.user,
        folderId: folderId,
        de: de,
        errors: []
    });
}

/**
 * Create data extension folder
 */
const createFolder = async (req, res) => {
    const folder = req.body;
    var result = await FuelSdkService.createFolder(folder);
    return res.status(200).json({
        success: true,
        result
    });
}

/**
 * Delete data extensions row
 */
const deleteDERow = async (req, res) => {
    const name = req.params.name;
    const body = req.body;
    var result = await FuelSdkService.deleteDataExtensionRow(name, body);
    return res.status(200).json({
        success: true,
        result
    });
}

/**
 * Create data extensions row
 */
const createDERow = async (req, res) => {
    const name = req.params.name;
    const body = req.body;
    var result = await FuelSdkService.createDataExtensionRow(name, body);
    return res.status(200).json({
        success: true,
        result
    });
}

/**
 * Update data extensions row
 */
const updateDERow = async (req, res) => {
    const name = req.params.name;
    const body = req.body;
    var result = await FuelSdkService.updateDataExtensionRow(name, body);
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
    detailsDEPage,
    deleteDE,
    createFolder,
    createDEPage,
    createDE,
    deleteDERow,
    createDERow,
    updateDERow
}