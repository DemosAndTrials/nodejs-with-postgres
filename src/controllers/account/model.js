import { getConnection } from '../../utils/postgresUtils';

class AccountModel {

    constructor() {
        this.SCHEMA_NAME = 'account';
    }

    async createSchema() {

        const client = await getConnection();

        const query = `CREATE TABLE ${this.SCHEMA_NAME}(
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL)`;

        try {
            const result = await client.query(query);
            console.log(`table ${this.SCHEMA_NAME} created`);
        }
        catch (e) {
            console.log(`error while creating table ${this.SCHEMA_NAME} :: ${e}`);
        }

        await client.end();
    }

    async createAccount(args) {

        const client = await getConnection();

        const query = `INSERT INTO ${this.SCHEMA_NAME}(name)
            VALUES ('${args.name}') RETURNING id;`;

        const { rows } = await client.query(query);
        await client.end();

        return rows[0];
    }

    async getAccounts() {

        const client = getConnection();

        const { rows } = await client.query(`SELECT * FROM ${this.SCHEMA_NAME}`);
        await client.end();

        return rows;
    }
}

export default new AccountModel();