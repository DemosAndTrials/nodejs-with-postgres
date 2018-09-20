import {
    v4 as uuid
} from 'uuid'
import CustomActivityConfig from '../../models/custom-activity/customActivityConfig';
import customActivityModel from '../../models/custom-activity/customActivityModel';

/**
 * Index page
 */
const indexPage = (req, res) => {
    res.render('pages/custom-activity/index', {
        userData: req.user
    });
}

/**
 * Setup page
 */
const setupPage = (req, res) => {
    res.render('pages/custom-activity/setup', {
        userData: req.user
    });
}

/**
 * List of configs page 
 */
const listPage = async (req, res) => {
    const configs = await customActivityModel.getConfigs();
    res.render('pages/custom-activity/list', {
        userData: req.user,
        configs
    });
}

/**
 * Create config page
 */
const createPage = (req, res) => {
    const host = req.headers.host;
    var config = new CustomActivityConfig(host);
    res.render('pages/custom-activity/create', {
        userData: req.user,
        errors: [],
        config,
    });
}

/**
 * Edit config page
 */
const editPage = async (req, res) => {
    const id = req.params.id;
    var config = await customActivityModel.getConfig(id);
    if (!config)
        return res.redirect('/ca/list');
    // get steps
    var steps = await customActivityModel.getConfigSteps(id);
    config.steps = steps;

    var splits = await customActivityModel.getConfigSplits(id);
    config.splits = splits;

    if (!config.steps)
        config.steps = [];
    if (!config.splits)
        config.splits = [];
    if (!config.schemaArgs)
        config.schemaArgs = [];
    res.render('pages/custom-activity/create', {
        userData: req.user,
        errors: [],
        config,
    });
}

/**
 * Validate and save configuration
 */
const createConfig = async (req, res) => {
    const config = req.body.config;
    // do validation
    req.check("config.name", "Name is required").notEmpty();
    req.check("config.key", "Key is required").notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        if (!config.splits)
            config.splits = [];
        if (!config.schemaArgs)
            config.schemaArgs = [];
        return res.render('pages/custom-activity/create', {
            userData: req.user,
            errors,
            config
        });
    }
    // save record
    if (!config.id)
        await customActivityModel.createConfig(config);
    else
        await customActivityModel.updateConfig(config);
    return res.redirect('/ca/list');
}

/**
 * Delete config
 */
const deleteConfig = async (req, res) => {
    const id = req.params.id;
    if (!id)
        return res.status(400).json(false);
    const result = await customActivityModel.deleteConfig(id);
    return res.status(200).json(result);
}

/**
 * Get config.json
 */
const getJson = async (req, res) => {
    const id = req.params.id;
    if (!id)
        return res.status(400).json(false);
    const config = await customActivityModel.getJson(id);
    return res.status(200).json(config);
}

export {
    indexPage,
    setupPage,
    createPage,
    editPage,
    deleteConfig,
    listPage,
    createConfig,
    getJson
}