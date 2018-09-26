import SDKClient from '../../utils/sdkClient'

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

    var options = {
        props: ["ParentFolder.ID", "ID", "Name", "ContentType"], //required
        filter: { //remove filter for all.
            leftOperand: 'ContentType',
            operator: 'equals',
            rightOperand: 'dataextension' //email
        }
    };
    var folder = SDKClient.folder(options);

    folder.get(function (err, response) {
        if (err) {
            console.log('err: ' + err);
            //res.status(500).send(err);
            res.redirect('500');
        } else {
            var statusCode = response && response.res && response.res.statusCode ? response.res.statusCode : 200;
            console.log('statusCode: ' + statusCode);
            var result = response && response.body ? response.body : response;

            //console.log('result: ' + result.Results);
            var data_folders = result.Results
            //response && res.status(statusCode).send(result.Results);
            res.render('pages/api/sdk/de-folders', {
                userData: req.user,
                data_folders: data_folders,
                selectedFolderId: '',
                parentFolderId: ''
            });
        }
    });
    console.log('efsadf');

    // res.render('pages/404', {
    //     userData: req.user,
    //     data_folders: data_folders,
    //     selectedFolderId: ''
    // });
}

async function get(folder) {
    return new Promise(function (resolve, reject) {
        folder.get(function (err, response) {
            if (err) {
                console.log('err: ' + err);
                //res.status(500).send(err);
                //res.redirect('500');
                reject(err);
            } else {
                var statusCode = response && response.res && response.res.statusCode ? response.res.statusCode : 200;
                console.log('statusCode: ' + statusCode);
                var result = response && response.body ? response.body : response;

                var data_folders = result.Results
                resolve(data_folders);
            }
        });
    })
}

/**
 * Get data extensions for specific folder
 */
const deFolderPage = async (req, res) => {
    const folderId = req.params.id;
    console.log('folderId: ' + folderId);
    var options = {
        props: ["ParentFolder.ID", "ID", "Name", "ContentType"], //required
        filter: { //remove filter for all.
            leftOperand: 'ContentType',
            operator: 'equals',
            rightOperand: 'dataextension' //email
        }
    };
    try {
        var folder = SDKClient.get(options);
        var data_folders = await operation(folder);
        console.log('data_folders: ' + JSON.stringify(data_folders));
        res.render('pages/api/sdk/de-folders', {
            userData: req.user,
            data_folders: data_folders,
            selectedFolderId: folderId,
            parentFolderId: ''
        });
    } catch (err) {
        console.log('err: ' + err);
        res.redirect('/500');
    }



    // res.render('pages/api/sdk/de-folders', {
    //     userData: req.user,
    //     data_folders: data_folders,
    //     selectedFolderId: folderId,
    //     parentFolderId: ''
    // });

    // folder.get(function (err, response) {
    //     if (err) {
    //         console.log('err: ' + err);
    //         //res.status(500).send(err);
    //         res.redirect('500');
    //     } else {
    //         var statusCode = response && response.res && response.res.statusCode ? response.res.statusCode : 200;
    //         console.log('statusCode: ' + statusCode);
    //         var result = response && response.body ? response.body : response;

    //         //console.log('result: ' + result.Results);
    //         var data_folders = result.Results
    //         //response && res.status(statusCode).send(result.Results);
    //         res.render('pages/api/sdk/de-folders', {
    //             userData: req.user,
    //             data_folders: data_folders,
    //             selectedFolderId: folderId,
    //             parentFolderId: ''
    //         });
    //     }
    // });

    // res.render('pages/api/sdk/de-folders', {
    //     userData: req.user,

    // });
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
    deFoldersPage,
    deFolderPage
}