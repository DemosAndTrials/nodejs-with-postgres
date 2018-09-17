import { isTableExists } from '../utils/postgresUtils';
import UserModel from '../models/user';
import AccountModel from '../models/account';
import customActivityModel from '../models/custom-activity/customActivityModel';

const createTables = async () => {
    var models = [
        UserModel,
        AccountModel,
        customActivityModel
    ];

    for (let model of models) {
        const isExists = await isTableExists(model.TABLE_NAME);
        if (!isExists) {
            await model.createTable();
        }
    }
}

export {
    createTables
}