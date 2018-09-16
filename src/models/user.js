import { getConnection } from '../utils/postgresUtils';

class UserModel {

    constructor() {
        this.TABLE_NAME = 'user';
    }

    async createTable() {
        const client = await getConnection();
        // users
        const query = `CREATE TABLE "${this.TABLE_NAME}"(
            id SERIAL PRIMARY KEY,
            active integer,
            email VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(30) NOT NULL             
        )`;

        try {
            const result = await client.query(query);
            console.log(`table ${this.TABLE_NAME} created`);
        } catch (e) {
            console.log(`error while creating table ${this.TABLE_NAME} : ${e}`);
        }

        await client.end();
    }

    async createUser(args) {
        const client = await getConnection();

        const query = `INSERT INTO "${this.TABLE_NAME}"(active, email, name, last_name, password, role)
            VALUES (1, '${args.email}', '${args.name}', '${args.lastname}', '${args.password}', 'member') RETURNING id;`;
            console.log(query);
        const { rows } = await client.query(query);
        await client.end();
        if (rows === undefined || rows.length == 0) {
            // array empty or does not exist
            return undefined;
        }
        return rows[0];
    }

    async getUser(email) {
        const client = getConnection();
        // use join with role
        const { rows } = await client.query(`SELECT * FROM "${this.TABLE_NAME}" WHERE email = '${email}'`);
        await client.end();

        return rows[0];
    }

    async getUsers() {
        const client = getConnection();
        // use join with role
        const { rows } = await client.query(`SELECT * FROM "${this.TABLE_NAME}"`);
        await client.end();

        return rows;
    }

}

export default new UserModel();