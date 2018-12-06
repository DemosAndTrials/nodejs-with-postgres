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

        const creatStepQuery = `CREATE TABLE "custom_activity_step"(
        config_id integer NOT NULL,
        label VARCHAR(100) NOT NULL,
        key VARCHAR(100) NOT NULL,
        CONSTRAINT config_id_fk FOREIGN KEY (config_id)
        REFERENCES custom_activity_config (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
    )`;

        const creatSplitQuery = `CREATE TABLE "custom_activity_split"(
        config_id integer NOT NULL,
        label VARCHAR(100) NOT NULL,
        value VARCHAR(100) NOT NULL,
        CONSTRAINT config_id_fk FOREIGN KEY (config_id)
        REFERENCES custom_activity_config (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
    )`;

        const creatSchemaQuery = `CREATE TABLE "custom_activity_schema_arg"(
        config_id integer NOT NULL,
        name VARCHAR(100) NOT NULL,
        access VARCHAR(10) NOT NULL,
        data_type VARCHAR(15) NOT NULL,
        direction VARCHAR(5) NOT NULL,
        is_nullable boolean NOT NULL,
        CONSTRAINT config_id_fk FOREIGN KEY (config_id)
        REFERENCES custom_activity_config (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
    )`;

        try {
            const result = await client.query(query);
            console.log(`table ${this.TABLE_NAME} created`);
            const result2 = await client.query(creatStepQuery);
            console.log(`table custom_activity_step created`);
            const result3 = await client.query(creatSplitQuery);
            console.log(`table custom_activity_split created`);
            const result4 = await client.query(creatSchemaQuery);
            console.log(`table custom_activity_schema_arg created`);
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
        const {
            rows
        } = await client.query(query);
        if (!args.id) {
            const id = rows[0].id;
            args.endpoint_url = args.endpoint_url + '/' + id;
            if (args.edit_url.includes('ca/ui'))
                args.edit_url = args.endpoint_url + '/ui/edit';

            const updateConfigQuery = `UPDATE ${this.TABLE_NAME}
                           SET edit_url = '${args.edit_url}', endpoint_url = '${args.endpoint_url}'
                           WHERE id = ${id}`;
            var result = await client.query(updateConfigQuery);
            // insert related data            
            if (args.steps) {
                var values = '';
                args.steps.forEach(function (step) {
                    values += `(${id}, '${step.label}', '${step.key}'),`;
                });
                values = values.slice(0, -1);
                const insertStepsQuery = `INSERT INTO custom_activity_step(
                    config_id, label, key)
                    VALUES ${values}`;
                var result2 = await client.query(insertStepsQuery);
            }
            if (args.splits) {
                var values = '';
                args.splits.forEach(function (split) {
                    values += `(${id}, '${split.label}', '${split.value}'),`;
                });
                values = values.slice(0, -1);
                const insertSplitsQuery = `INSERT INTO custom_activity_split(
                    config_id, label, value)
                    VALUES ${values}`;
                var result2 = await client.query(insertSplitsQuery);
            }
            if (args.schemaArgs) {
                var values = '';
                args.schemaArgs.forEach(function (schema) {
                    values += `(${id}, '${schema.name}', '${schema.access}', '${schema.data_type}', '${schema.is_nullable}', '${schema.direction}'),`;
                });
                values = values.slice(0, -1);
                const insertSchemaQuery = `INSERT INTO custom_activity_schema_arg(
                    config_id, name, access, data_type, is_nullable, direction)
                    VALUES ${values}`;
                var result2 = await client.query(insertSchemaQuery);
            }
        }
        await client.end();
        //console.log(rows);
        return rows[0];
    }

    async updateConfig(config) {
        const client = getConnection();
        var updateQuery = `UPDATE public.custom_activity_config
        SET name='${config.name}', key='${config.key}', config_on_drop=${config.config_on_drop}, is_configured=${config.is_configured}, use_jwt=${config.use_jwt}, 
            description='${config.description}', big_image_url='${config.big_image_url}', small_image_url='${config.small_image_url}', type='${config.type}', 
            edit_height=${config.edit_height}, edit_width=${config.edit_width}, edit_url='${config.edit_url}', endpoint_url='${config.endpoint_url}'
        WHERE id =${config.id}`;
        var result = await client.query(updateQuery);
        // update steps
        await client.query(`DELETE FROM custom_activity_step WHERE config_id =${config.id}`);
        if (config.steps) {
            var values = '';
            config.steps.forEach(function (step) {
                values += `(${config.id}, '${step.label}', '${step.key}'),`;
            });
            values = values.slice(0, -1);
            const insertStepsQuery = `INSERT INTO custom_activity_step(
                config_id, label, key)
                VALUES ${values}`;
            var result2 = await client.query(insertStepsQuery);
        }
        // update splits
        await client.query(`DELETE FROM custom_activity_split WHERE config_id =${config.id}`);
        if (config.splits) {
            var values = '';
            config.splits.forEach(function (split) {
                values += `(${config.id}, '${split.label}', '${split.value}'),`;
            });
            values = values.slice(0, -1);
            const insertSplitsQuery = `INSERT INTO custom_activity_split(
                config_id, label, value)
                VALUES ${values}`;
            var result2 = await client.query(insertSplitsQuery);
        }
        await client.query(`DELETE FROM custom_activity_schema_arg WHERE config_id =${config.id}`);
        if (config.schemaArgs) {
            var values = '';
            config.schemaArgs.forEach(function (schema) {
                values += `(${config.id}, '${schema.name}', '${schema.access}', '${schema.data_type}', '${schema.is_nullable}', '${schema.direction}'),`;
            });
            values = values.slice(0, -1);
            const insertSchemaQuery = `INSERT INTO custom_activity_schema_arg(
                config_id, name, access, data_type, is_nullable, direction)
                VALUES ${values}`;
            var result2 = await client.query(insertSchemaQuery);
            //console.log(values);
        }
        await client.end();
    }

    async getConfigs() {
        const client = getConnection();
        const query = `SELECT config.*, COUNT(step.config_id) AS steps
               FROM ${this.TABLE_NAME} config
               INNER JOIN custom_activity_step step on step.config_id = config.id
               GROUP BY config.id
               ORDER BY config.id`;
        const {
            rows
        } = await client.query(query);
        await client.end();

        return rows;
    }

    async getConfig(id) {
        const client = getConnection();

        const {
            rows
        } = await client.query(`SELECT * FROM ${this.TABLE_NAME} WHERE id =${id}`);
        await client.end();

        return rows[0];
    }

    async getConfigSteps(configId) {
        const client = getConnection();

        const {
            rows
        } = await client.query(`SELECT * FROM custom_activity_step WHERE config_id = ${configId}`);
        await client.end();

        return rows;
    }

    async getConfigSplits(configId) {
        const client = getConnection();

        const {
            rows
        } = await client.query(`SELECT * FROM custom_activity_split WHERE config_id = ${configId}`);
        await client.end();

        return rows;
    }

    async getConfigSchemaArgs(configId) {
        const client = getConnection();

        const {
            rows
        } = await client.query(`SELECT * FROM custom_activity_schema_arg WHERE config_id = ${configId}`);
        await client.end();

        return rows;
    }

    async getJson(id) {
        const client = getConnection();
        const {
            rows
        } = await client.query(`SELECT * FROM ${this.TABLE_NAME} WHERE id =${id}`);
        await client.end();
        var config = rows[0];
        if (!config)
            return '';

        var json = {
            workflowApiVersion: '1.1',
            metaData: {
                icon: config.big_image_url,
                iconSmall: config.small_image_url,
                category: 'message',
                isConfigured: config.is_configured,
                configOnDrop: config.config_on_drop
            },
            type: 'REST',
            lang: {
                "en-US": {
                    name: config.name,
                    description: config.description
                }
            },
            arguments: {
                execute: {
                    inArguments: [],
                    url: config.endpoint_url + '/execute',
                    verb: 'POST',
                    body: '',
                    header: '',
                    useJwt: config.use_jwt,
                    timeout: 10000
                }
            },
            configurationArguments: {
                applicationExtensionKey: config.key,
                save: {
                    url: config.endpoint_url + '/save',
                    useJwt: config.use_jwt
                },
                publish: {
                    url: config.endpoint_url + '/publish',
                    useJwt: config.use_jwt
                },
                validate: {
                    url: config.endpoint_url + '/validate',
                    useJwt: config.use_jwt
                },
                stop: {
                    url: config.endpoint_url + '/stop',
                    useJwt: config.use_jwt
                }
            },
            wizardSteps: [],
            userInterfaces: {
                configModal: {
                    height: config.edit_height,
                    width: config.edit_width,
                    fullscreen : true,
                    url: config.endpoint_url + '/ui?numSteps=' //num of steps
                },
                runningModal: {
                    url: config.endpoint_url + '/ui/modal'
                },
                runningHover: {
                    url: config.endpoint_url + '/ui/hover'
                }
            }
        };
        // steps
        var steps = await this.getConfigSteps(id);
        var jsonArr = [];
        steps.forEach(function (step) {
            jsonArr.push({
                label: `${step.label}`,
                key: `${step.key}`
            });
        });
        json.wizardSteps = jsonArr;
        // splits
        var splits = await this.getConfigSplits(id);
        if (splits.length > 0) {
            var jsonArr = [];
            splits.forEach(function (split) {
                jsonArr.push({
                    arguments: {
                        branchResult: split.value
                    },
                    metaData: {
                        label: split.label
                    }
                });
            });
            json.outcomes = jsonArr;
        }
        // schemaArgs TODO
        var schemaArgs = await this.getConfigSchemaArgs(id);
        var inArguments = [];
        var outArguments = [];
        if (schemaArgs.length > 0) {
            schemaArgs.forEach(function (schema) {
                var arg = {};
                arg[schema.name] = {
                    dataType: `${schema.data_type}`,
                    isNullable: `${schema.is_nullable}`,
                    direction: `${schema.direction}`
                };
                if (schema.direction === 'in') {
                    inArguments.push(arg);
                } else { // out
                    outArguments.push(arg);
                }
            });
        }
        json.schema = {
            arguments: {
                execute: {
                    inArguments: inArguments,
                    outArguments: outArguments
                }
            }
        };
        return json;
    }

    /**
     * Delete record by Id
     */
    async deleteConfig(id) {
        const client = getConnection();
        const result = await client.query(`DELETE FROM ${this.TABLE_NAME} WHERE id =${id}`);
        await client.end();
        return result.rowCount === 1;
    }
}

export default new CustomActivityModel();