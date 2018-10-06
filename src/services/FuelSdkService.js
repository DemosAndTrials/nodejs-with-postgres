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
     * Get Data Extension by CustomerKey
     */
    async getDataExtension(key) {
        var options = {
            props: ['ObjectID', 'Name', 'CustomerKey', 'Description', 'isSendable', 'isTestable', 'CreatedDate', 'ModifiedDate'] //required
                ,
            filter: { // remove filter for all.
                leftOperand: 'ObjectID',
                operator: 'equals',
                rightOperand: key
            }
        };
        var de = SDKClient.dataExtension(options);
        try {
            var result = await this.get(de);
            //console.log('result: ' + JSON.stringify(result));
            return result[0];
        } catch (err) {
            console.log('err: ' + err);
        }
        return;
    }

    /**
     * Get Data Extension Columns by CustomerKey
     */
    async getDataExtensionColumns(key) {
        var options = {
            props: ['ObjectID', 'PartnerKey', 'Name', 'DefaultValue', 'MaxLength', 'IsRequired', 'Ordinal', 'IsPrimaryKey', 'FieldType', 'CreatedDate', 'ModifiedDate', 'Scale', 'Client.ID', 'CustomerKey'] //required	
                ///*
                ,
            filter: { //remove filter for all.
                leftOperand: 'DataExtension.CustomerKey',
                operator: 'equals',
                rightOperand: key
            }
            //*/	
        };
        var deColumn = SDKClient.dataExtensionColumn(options);
        try {
            var result = await this.get(deColumn);
            if (result && result.length > 1) // sort columns
                result.sort((a, b) => (a.Ordinal > b.Ordinal) ? 1 : ((b.Ordinal > a.Ordinal) ? -1 : 0));
            //console.log('result: ' + JSON.stringify(result));
            return result;
        } catch (err) {
            console.log('err: ' + err);
        }
        return;
    }

    /**
     * Get Data Extension Rows by CustomerKey
     */
    async getDataExtensionRows(key, cols) {
        var options = {
            Name: key //required
                ,
            props: cols //['Key'] //required
            /*
            ,filter: {						//remove filter for all.
                leftOperand: 'Value',
                operator: 'equals',
                rightOperand: 'Some random text for the value field'
               }
               */
        };
        var deRow = SDKClient.dataExtensionRow(options);
        try {
            var result = await this.get(deRow);
            //console.log('result: ' + JSON.stringify(result));
            return result;
        } catch (err) {
            console.log('err: ' + err);
        }
        return;
    }

    /**
     * Create Data Extension Row by key
     */
    async createDataExtensionRow(name, row) {
        console.log('name: ' + name);
        var options = {
            Name: name,
            props: row	
        };
        var deRow = SDKClient.dataExtensionRow(options)
        try {
            var result = await this.post(deRow);
            var arr = result.Results[0].Object.Properties.Property;
            //console.log('arr: ' + JSON.stringify(arr));
            return arr;
        } catch (err) {
            console.log('err: ' + err);
        }
        return;
    }

    /**
     * Update Data Extension Row by key
     */
    async updateDataExtensionRow(name, row) {
        var options = {
            Name: name,
            props: row	
        };
        var deRow = SDKClient.dataExtensionRow(options)
        try {
            var result = await this.patch(deRow);
            var arr = result.Results[0].Object.Properties.Property;
            //console.log('arr: ' + JSON.stringify(arr));
            return arr;
        } catch (err) {
            console.log('err: ' + err);
        }
        return;
    }

    /**
     * Delete Data Extension Row by key
     */
    async deleteDataExtensionRow(name, row) {
        var options = {
            Name: name,
            props: row	
        };
        var deRow = SDKClient.dataExtensionRow(options)
        try {
            var result = await this.delete(deRow);
            return result;
        } catch (err) {
            console.log('err: ' + err);
        }
        return;
    }

     /**
     * Create Data Extension
     */
    async createDataExtension(folderId, de) {
        console.log('folderId: ' + folderId);
        console.log('de: ' + de);
        var options = {
            props: {"Name" : "SDKDataExtension", "Description": "SDK Created Data Extension"}
            ,columns: [	{"Name" : "Key", "FieldType" : "Text", "IsPrimaryKey" : "true", "MaxLength" : "100", "IsRequired" : "true"}
                        ,{"Name" : "Value", "FieldType" : "Text"}
                    ]
        };		
        var de = SDKClient.dataExtension(options);	
        try {
            var result = await this.post(de);
            var arr = result.Results[0].Object.Properties.Property;
            console.log('arr: ' + JSON.stringify(arr));
            return arr;
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

    //****************************************************************************************
    //								Helpers
    //****************************************************************************************

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
                    //var statusCode = response && response.res && response.res.statusCode ? response.res.statusCode : 200;
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
     * Delete
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

    /**
     * Patch
     */
    async patch(etObject) {
        return new Promise(function (resolve, reject) {
            etObject.patch(function (err, response) {
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