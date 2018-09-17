import {
    getConnection
} from '../../utils/postgresUtils';

class CustomActivityModel {

    constructor() {
        this.TABLE_NAME = 'custom_activity_config';
    }

    async createTable() {
        const client = await getConnection();
        // users
        const query = `CREATE TABLE "${this.TABLE_NAME}"(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        key VARCHAR(255) NOT NULL,
        config_on_drop boolean,
        is_configured boolean,
        use_jwt boolean,
        description VARCHAR(255) NOT NULL,
        big_image_url VARCHAR(255) NOT NULL,
        small_image_url VARCHAR(255) NOT NULL,
        type VARCHAR(25) NOT NULL,
        edit_height integer NOT NULL,
        edit_width integer NOT NULL,
        edit_url VARCHAR(255) NOT NULL,
        endpoint_url VARCHAR(255) NOT NULL           
    )`;

        try {
            const result = await client.query(query);
            console.log(`table ${this.TABLE_NAME} created`);
        } catch (e) {
            console.log(`error while creating table ${this.TABLE_NAME} : ${e}`);
        }

        await client.end();
    }

    async createConfig(args) {
        const client = await getConnection();

        const query = `INSERT INTO ${this.TABLE_NAME}
        (name, key, config_on_drop, is_configured, use_jwt, description, big_image_url, small_image_url, type, edit_height, edit_width, edit_url, endpoint_url)
            VALUES ('${args.name}', '${args.key}', ${args.config_on_drop}, ${args.is_configured}, ${args.use_jwt}, '${args.description}', '${args.big_image_url}', 
            '${args.small_image_url}', '${args.type}', ${args.edit_height}, ${args.edit_width}, '${args.edit_url}', '${args.endpoint_url}') RETURNING id;`;
        console.log(query);
        const {
            rows
        } = await client.query(query);
        await client.end();

        return rows[0];
    }

    async getConfigs() {
        const client = getConnection();

        const {
            rows
        } = await client.query(`SELECT * FROM ${this.TABLE_NAME}`);
        await client.end();

        return rows;
    }
}

export default new CustomActivityModel();