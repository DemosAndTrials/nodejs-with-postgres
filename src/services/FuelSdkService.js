import SDKClient from '../utils/sdkClient';

class FuelSdkService {

    /**
     * Get all Data Extensions Folders
     */
    async getFolders() {

        var options = {
            props: ["ParentFolder.ID", "ID", "Name", "ContentType"], //required
            filter: { //remove filter for all.
                leftOperand: 'ContentType',
                operator: 'equals',
                rightOperand: 'dataextension' //email
            }
        };

        var folder = SDKClient.folder(options);
        try {
            var data_folders = await this.get(folder);
            return data_folders;
        } catch (err) {
            console.log('err: ' + err);
        }
        return undefined;
    }

    /**
     * Get Data Extensions by Category (Folder)
     */
    async getDataExtensions(folderId) {
        var options = {
            props: ['ObjectID', 'Name', 'CategoryID', 'CustomerKey', 'Description', 'isSendable', 'isTestable'] //required
                ,
            filter: { //remove filter for all.
                leftOperand: 'CategoryID',
                operator: 'equals',
                rightOperand: folderId
            }
        };
        var de = SDKClient.dataExtension(options);
        try {
            var de_folders = await this.get(de);
            //console.log('de_folders length: ' + de_folders.length);
            //console.log('de_folders: ' + JSON.stringify(de_folders));
            return de_folders;
        } catch (err) {
            console.log('err: ' + err);
        }
        return;
    }

    /**
     * Delete Data Extensions by key
     */
    async deleteDataExtension(key) {
        console.log('key: ' + key);
        var options = {
            props: {
                'CustomerKey': key
            } // required
        };
        var de = SDKClient.dataExtension(options);
        try {
            var result = await this.delete(de);
            //console.log('de_folders length: ' + de_folders.length);
            //console.log('de_folders: ' + JSON.stringify(de_folders));
            return result;
        } catch (err) {
            console.log('err: ' + err);
        }
        return;
    }

    /**
     * Delete Data Extensions by key
     */
    async createFolder(newFolder) {
        // TODO: bug report , description is mandatory
        var options = {
            props: {
                "Name": newFolder.name,
                "Description": newFolder.name,
                "ContentType": "dataextension",
                "ParentFolder": {
                    "ID": newFolder.parentId
                },
                "Active": "true",
                "AllowChildren": "true",
                "IsEditable": "true"
            }
        };
        var folder = SDKClient.folder(options);
        try {
            var result = await this.post(folder);
            newFolder.id = result.Results[0].NewID;
            console.log('newFolder: ' + JSON.stringify(newFolder));
            return newFolder;
        } catch (err) {
            console.log('err: ' + err);
        }
        return;
    }

    /**
     * Get
     */
    async get(etObject) {
        return new Promise(function (resolve, reject) {
            etObject.get(function (err, response) {
                if (err) {
                    console.log('err: ' + err);
                    //res.status(500).send(err);
                    //res.redirect('500');
                    reject(err);
                } else {
                    var statusCode = response && response.res && response.res.statusCode ? response.res.statusCode : 200;
                    var result = response && response.body ? response.body : response;
                    var items = result.Results
                    resolve(items);
                }
            });
        })
    }

    /**
     * Post
     */
    async post(etObject) {
        return new Promise(function (resolve, reject) {
            etObject.post(function (err, response) {
                if (err) {
                    console.log('err: ' + err);
                    reject(err);
                } else {
                    //var statusCode = response && response.res && response.res.statusCode ? response.res.statusCode : 200;
                    var result = response && response.body ? response.body : response;
                    console.log('result: ' + JSON.stringify(result));
                    resolve(result);
                }
            });
        })
    }

    /**
     * Delete Data Extension
     */
    async delete(etObject) {
        return new Promise(function (resolve, reject) {
            etObject.delete(function (err, response) {
                if (err) {
                    console.log('err: ' + err);
                    reject(err);
                } else {
                    //var statusCode = response && response.res && response.res.statusCode ? response.res.statusCode : 200;
                    var result = response && response.body ? response.body : response;
                    console.log('result: ' + JSON.stringify(result));
                    resolve(result);
                }
            });
        })
    }

}

export default new FuelSdkService();