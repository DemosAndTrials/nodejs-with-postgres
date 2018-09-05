import { isTableExists } from '../utils/postgresUtils';
import { AccountModel } from '../controllers/account';

const createTables = async () => {

    var models = [
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