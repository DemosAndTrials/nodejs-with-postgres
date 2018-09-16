import { isTableExists } from '../utils/postgresUtils';
import UserModel from '../models/user';
import AccountModel from '../models/account';

const createTables = async () => {
    var models = [
        UserModel,
        AccountModel
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