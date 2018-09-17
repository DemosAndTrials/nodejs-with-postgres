import {
    v4 as uuid
} from 'uuid'
import AccountModel from '../../models/account';
import CustomActivityConfig from '../../models/custom-activity/customActivityConfig';
import customActivityModel from '../../models/custom-activity/customActivityModel';

const indexPage = (req, res) => {
    res.render('pages/custom-activity/index', {
        userData: req.user
    });
}

const setupPage = (req, res) => {
    res.render('pages/custom-activity/setup', {
        userData: req.user
    });
}

const listPage = (req, res) => {
    res.render('pages/custom-activity/list', {
        userData: req.user
    });
}

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
 * Validate and save configuration
 */
const createConfig = async (req, res) => {
    const config = req.body.config;
    console.log(req.body);
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
    const record = await customActivityModel.createConfig(config);
    console.log(record);
    return res.redirect('/ca/list');
}

const getAccounts = async (req, res) => {

    const accounts = await AccountModel.getAccounts();

    return res.status(200).json({
        success: true,
        accounts
    });
}

export {
    indexPage,
    setupPage,
    createPage,
    listPage,
    createConfig,
    getAccounts
}