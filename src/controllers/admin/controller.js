import AdminModel from './model';

const indexPage = async (req, res) => {
    res.render('pages/admin/index' , { userData: req.user });
}

const usersPage = async (req, res) => {
    const users = await AdminModel.getUsers();
    res.render('pages/admin/users' , { userData: req.user, users });
}

const rolesPage = async (req, res) => {
    const roles = await AdminModel.getRoles();
    res.render('pages/admin/roles' , { userData: req.user, roles });
}

const createAccount = async (req, res) => {

    const { name } = req.body;
    console.log(name);
    if (!name) {
        return res.status(500).json({ success: false, message: 'missing account name' });
    }

    const account = await AdminModel.createAccount({ name });

    return res.status(200).json({ success: true, account });
}

const getUsers = async (req, res) => {

    const users = await AdminModel.getUsers();

    return res.status(200).json({ success: true, users });
}

const getRoles = async (req, res) => {

    const users = await AdminModel.getRoles();

    return res.status(200).json({ success: true, users });
}

export {
    indexPage,
    usersPage,
    rolesPage,
    createAccount,
    getUsers,
    getRoles
}