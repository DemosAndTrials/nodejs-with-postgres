import 'regenerator-runtime/runtime';
import pg from 'pg';

const SCHEMA = 'public';

const getConnection = () => {

    const client = new pg.Client({
        connectionString: process.env.DATABASE_URL || 'postgres://postgres:admin@localhost:5432/postgres?currentSchema=' + SCHEMA,
        // use only in production
        // ssl: (process.env.DATABASE_SSL !== 'false')
    });
    client.connect();

    return client;
}

const isTableExists = async (tableName) => {

    const client = getConnection();
    const query = await client.query(
        `SELECT EXISTS (
            SELECT 1
            FROM   information_schema.tables
            WHERE  table_schema = '${SCHEMA}' AND table_name = '${tableName}'
            );`);

    await client.end();
    return query.rows[0].exists;
}

export {
    getConnection,
    isTableExists
}