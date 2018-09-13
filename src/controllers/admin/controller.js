import AdminModel from './model';

const createAccount = async (req, res) => {

    const { name } = req.body;
    console.log(name);
    if (!name) {
        return res.status(500).json({ success: false, message: 'missing account name' });
    }

    const account = await AdminModel.createAccount({ name });

    return res.status(200).json({ success: true, account });
}

const getAccounts = async (req, res) => {

    const accounts = await AdminModel.getAccounts();

    return res.status(200).json({ success: true, accounts });
}

export {
    createAccount,
    getAccounts
}