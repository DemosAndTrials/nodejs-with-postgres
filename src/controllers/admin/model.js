import { getConnection } from '../../utils/postgresUtils';

class AdminModel {

    constructor() {
        this.TABLE_NAME = 'account';
    }

    async createTable() {

        const client = await getConnection();

        const query = `CREATE TABLE ${this.TABLE_NAME}(
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL)`;

        try {
            const result = await client.query(query);
            console.log(`table ${this.TABLE_NAME} created`);
        }
        catch (e) {
            console.log(`error while creating table ${this.TABLE_NAME} : ${e}`);
        }

        await client.end();
    }

    async createAccount(args) {

        const client = await getConnection();

        const query = `INSERT INTO ${this.TABLE_NAME}(name)
            VALUES ('${args.name}') RETURNING id;`;

        const { rows } = await client.query(query);
        await client.end();

        return rows[0];
    }

    async getAccounts() {

        const client = getConnection();

        const { rows } = await client.query(`SELECT * FROM ${this.TABLE_NAME}`);
        await client.end();

        return rows;
    }
}

export default new AdminModel();