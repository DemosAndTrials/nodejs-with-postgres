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

        try {
            const result = await client.query(query);
            console.log(`table ${this.TABLE_NAME} created`);
            const result2 = await client.query(creatStepQuery);
            console.log(`table custom_activity_step created`);
            const result3 = await client.query(creatSplitQuery);
            console.log(`table custom_activity_split created`);
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
        //console.log('before: ' + args);
        if (!args.id) {
            const id = rows[0].id;
            console.log('new config: ' + id);
            args.endpoint_url = args.endpoint_url + '/' + id;
            if (args.edit_url.includes('ca/ui'))
                args.edit_url = args.endpoint_url + '/ui/edit';
            //console.log('after: ' + args);

            const updateConfigQuery = `UPDATE ${this.TABLE_NAME}
                           SET edit_url = '${args.edit_url}', endpoint_url = '${args.endpoint_url}'
                           WHERE id = ${id}`;
            //console.log('updateConfigQuery: ' + updateConfigQuery);
            var result = await client.query(updateConfigQuery);
            console.log('args.splits: ' + args.steps);
            // insert related data            
            if (args.steps) {
                var values = '';
                args.steps.forEach(function (step) {
                    console.log(step);
                    values += `(${id}, '${step.label}', '${step.key}'),`;
                });
                values = values.slice(0, -1);
                const insertStepsQuery = `INSERT INTO custom_activity_step(
                    config_id, label, key)
                    VALUES ${values}`;
                var result2 = await client.query(insertStepsQuery);

                //console.log('result2: ' + JSON.stringify(result2));
            }
            if (args.splits) {
                var values = '';
                args.splits.forEach(function (split) {
                    console.log(split);
                    values += `(${id}, '${split.label}', '${split.value}'),`;
                });
                values = values.slice(0, -1);
                const insertSplitsQuery = `INSERT INTO custom_activity_split(
                    config_id, label, value)
                    VALUES ${values}`;
                var result2 = await client.query(insertSplitsQuery);
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
        // update steps
        console.log('updateQuery: ' + updateQuery);
        var result = await client.query(updateQuery);
        await client.query(`DELETE FROM custom_activity_step WHERE config_id =${config.id}`);
        if (config.steps) {
            var values = '';
            config.steps.forEach(function (step) {
                console.log(step);
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
                console.log(split);
                values += `(${config.id}, '${split.label}', '${split.value}'),`;
            });
            values = values.slice(0, -1);
            const insertSplitsQuery = `INSERT INTO custom_activity_split(
                config_id, label, value)
                VALUES ${values}`;
            var result2 = await client.query(insertSplitsQuery);
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
            wizardSteps: [], // TODO
            userInterfaces: {
                configModal: {
                    height: config.edit_height,
                    width: config.edit_width,
                    url: config.endpoint_url + '?numSteps=' //num of steps
                },
                runningModal: {
                    url: config.endpoint_url + '/ui/modal'
                },
                runningHover: {
                    url: config.endpoint_url + '/ui/hover'
                }
            },
            schema: {
                arguments: {
                    execute: {},
                    inArguments: [],
                    outArguments: []
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
        console.log('jsonArr: ' + JSON.stringify(jsonArr));


        //console.log(json);
        return json;
    }

    /**
     * Delete record by Id
     */
    async deleteConfig(id) {
        const client = getConnection();
        const result = await client.query(`DELETE FROM ${this.TABLE_NAME} WHERE id =${id}`);
        await client.end();
        console.log(result);
        return result.rowCount === 1;
    }
}

export default new CustomActivityModel();