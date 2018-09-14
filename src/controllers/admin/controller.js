import UserModel from '../../models/user';

const indexPage = async (req, res) => {
    res.render('pages/admin/index' , { userData: req.user });
}

const usersPage = async (req, res) => {
    const users = await UserModel.getUsers();
    res.render('pages/admin/users' , { userData: req.user, users });
}

const createAccount = async (req, res) => {

    const { name } = req.body;
    console.log(name);
    if (!name) {
        return res.status(500).json({ success: false, message: 'missing account name' });
    }

    const account = await UserModel.createAccount({ name });

    return res.status(200).json({ success: true, account });
}

const getUsers = async (req, res) => {

    const users = await UserModel.getUsers();

    return res.status(200).json({ success: true, users });
}

export {
    indexPage,
    usersPage,
    createAccount,
    getUsers,
}