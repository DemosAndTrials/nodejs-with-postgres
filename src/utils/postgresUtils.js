import pg from 'pg';

const getConnection = () => {

    const client = new pg.Client({
        connectionString: process.env.DATABASE_URL || 'postgres',
        // use only in production
        // ssl: (process.env.DATABASE_SSL !== 'false')
    });
    client.connect();

    return client;
}

const isSchemaExists = async (schemaName) => {

    const client = getConnection();
    const query = await client.query(
        `SELECT EXISTS (
            SELECT 1
            FROM   information_schema.tables
            WHERE  table_name = '${schemaName}'
            );`);

    await client.end();

    return query.rows[0].exists;
}

export {
    getConnection,
    isSchemaExists
}