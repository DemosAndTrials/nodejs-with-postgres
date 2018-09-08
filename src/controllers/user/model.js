import { getConnection } from '../../utils/postgresUtils';

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
                    password VARCHAR(255) NOT NULL                    
                )`;
        // roles
        const createRoleTable = `CREATE TABLE "role"(
                    id SERIAL NOT NULL,
                    role character varying(255),
                    CONSTRAINT role_pkey PRIMARY KEY (id)               
                )`;
        const createRoles = `INSERT INTO role(role)
                        VALUES ('admin'),('member')`
        // user role
        const queryUserRole = `CREATE TABLE "user_role"(
            user_id integer NOT NULL,
            role_id integer NOT NULL,
            CONSTRAINT user_role_pkey PRIMARY KEY (user_id, role_id),
            CONSTRAINT user_fk FOREIGN KEY (user_id)
                REFERENCES "user" (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION,
            CONSTRAINT role_fk FOREIGN KEY (role_id)
                REFERENCES role (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION         
                )`;
        try {
            const result = await client.query(query);
            console.log(`table ${this.TABLE_NAME} created`);
            const result1 = await client.query(createRoleTable);
            const result11 = await client.query(createRoles);
            console.log(`table role created`);
            const result2 = await client.query(queryUserRole);
            console.log(`table user_role created`);
        }
        catch (e) {
            console.log(`error while creating table ${this.TABLE_NAME} : ${e}`);
        }

        await client.end();
    }

    async createUser(args) {
        const client = await getConnection();

        const query = `INSERT INTO "${this.TABLE_NAME}"(active, email, name, last_name, password)
            VALUES (1, '${args.email}', '${args.name}', '${args.lastName}', '${args.password}') RETURNING id;`;
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
        console.log(email);
        const client = getConnection();
        const { rows } = await client.query(`SELECT * FROM "${this.TABLE_NAME}" WHERE email = '${email}'`);
        await client.end();

        return rows[0];
    }

    async getUsers() {

        const client = getConnection();

        const { rows } = await client.query(`SELECT * FROM "${this.TABLE_NAME}"`);
        await client.end();

        return rows;
    }
}

export default new UserModel();