
const createAccount = (req, res) => {


}

const getAccounts = (req, res) => {
    return res.status(200).json({ success: true, message: 'Get all accounts' });
}

export {
    createAccount,
    getAccounts
}