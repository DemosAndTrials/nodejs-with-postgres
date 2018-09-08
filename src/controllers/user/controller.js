import UserModel from './model';


const loginPage = (req, res) => {
    console.log(req);
    res.render('pages/user/login');
}

const signupPage = (req, res) => {
    var errors = [];
    var user = { name:"", lastname:"", email:"", password:""};
    console.log(user);
    res.render('pages/user/signup', {user, errors});
}

const createUser = async (req, res) => {
    // do some validation here
    const body = req.body;
    console.log(body);
    const userExists = await UserModel.getUser(body.email);
    //console.log(userExists);
    if (userExists !== undefined) {
        // email already registered
        // error
        var user = { name:body.name, lastname:body.lastname, email:body.email, password:body.password};
        var errors = [];
        console.log(user);
        res.render('pages/user/signup', { user, errors });
    } else { // create new user
        const user = await UserModel.createUser(body);
        console.log(user);
        res.render('pages/user/login');
    }
}

const profilePage = (req, res) => {
    console.log(req);
    res.render('pages/user/profile');
}


const createUser2 = async (req, res) => {

    const {
        name
    } = req.body;
    console.log(name);
    if (!name) {
        return res.status(500).json({
            success: false,
            message: 'missing account name'
        });
    }

    const account = await UserModel.createUser({
        name
    });

    return res.status(200).json({
        success: true,
        account
    });
}

const getUsers = async (req, res) => {

    const accounts = await UserModel.getUsers();

    return res.status(200).json({
        success: true,
        accounts
    });
}

export {
    loginPage,
    signupPage,
    profilePage,
    createUser,
    getUsers
}