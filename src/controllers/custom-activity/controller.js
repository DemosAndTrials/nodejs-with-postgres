import {
    v4 as uuid
} from 'uuid'
import AccountModel from '../../models/account';
import CustomActivityConfig from '../../models/custom-activity/customActivityConfig';

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

const createPage = (req, res) => {
    console.log(req.headers.host);
    const host = req.headers.host;
    var config = new CustomActivityConfig()
    config.name = 'My Custom Activity';
    config.key = uuid();
    config.typeSelect = 'RESTDECISION';
    config.editHeight = 600;
    config.editWidth = 800;
    console.log(config);

    var config1 = {

        name: 'My Custom Activity',
        key: '', //uuid(),
        typeSelect: 'RESTDECISION',
        editHeight: 600,
        editWidth: 800
    };
    res.render('pages/custom-activity/create', {
        userData: req.user,
        errors: [],
        config,
        config1
    });
}

const listPage = (req, res) => {
    res.render('pages/custom-activity/list', {
        userData: req.user
    });
}

const createConfig = async (req, res) => {
    const body = req.body;
    console.log(body);

    req.checkBody("key", "Key is required").notEmpty();
    var errors = req.validationErrors();
    console.log(errors);
    if (errors) {
        var config = {

            name: 'My Custom Activity',
            key: '', //uuid(),
            typeSelect: 'RESTDECISION',
            editHeight: 600,
            editWidth: 800
        };
        return res.render('pages/custom-activity/create', {
            userData: req.user,
            errors,
            config
        });
    }
    if (!body) {
        return res.status(500).json({
            success: false,
            message: 'missing account name'
        });
    }

    //const account = await AccountModel.createAccount({ name });

    return res.status(200).json({
        success: true,
        body
    });
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