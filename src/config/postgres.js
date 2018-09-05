import { isSchemaExists } from '../utils/postgresUtils';
import { AccountModel } from '../controllers/account';

const createSchemas = async () => {

    var models = [
        AccountModel
    ];

    for (let model of models) {
        const isExists = await isSchemaExists(model.SCHEMA_NAME);
        if (!isExists) {
            await model.createSchema();
        }
    }
}

export {
    createSchemas
}