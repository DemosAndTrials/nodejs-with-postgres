import UserModel from './model';

const loginPage = async (req, res) => {

    if (req.method === 'GET') {
        var errors = [];
        var user = {
            email: '',
            password: ''
        };
        res.render('pages/user/login', {
            user,
            errors
        });
    } else { // post
        const body = req.body;
        console.log(body);
        // validation here
        req.checkBody("email", "Enter a valid email address.").isEmail();
        req.checkBody("password", "Password is required").notEmpty();

        var errors = req.validationErrors();
        console.log(errors);
        if (errors) {
            var user = {
                email: body.email,
                password: body.password
            };
            res.render('pages/user/login', {
                user,
                errors
            });
        } else {  // normal processing here
            console.log('OK');
            res.render('pages/home');

        }
    }
}

const logoutPage = (req, res) => {
    // logout logic goes here
    res.render('pages/home');
}

const signupPage = async (req, res) => {

    if (req.method === 'GET') {
        var errors = [];
        var user = {
            name: '',
            lastname: '',
            email: '',
            password: ''
        };
        res.render('pages/user/signup', {
            user,
            errors
        });
    } else { // post
        const body = req.body;
        console.log(body);

        // validation here
        req.checkBody("name", "First Name is required").notEmpty();
        //req.checkBody("name", "First Name must be at least 2 characters").isLength({ min: 2 });
        req.checkBody("lastname", "Last Name is required").notEmpty();
        //req.checkBody("lastname", "First Name must be at least 2 characters").isLength({ min: 2 });
        req.checkBody("email", "Enter a valid email address.").isEmail();
        req.checkBody("password", "Password is required").notEmpty();
        req.checkBody("password", "Password must be at least 6 characters").isLength({ min: 6 });

        var errors = req.validationErrors();
        console.log(errors);
        if (errors) {
            //res.send(errors);
            var user = {
                name: body.name,
                lastname: body.lastname,
                email: body.email,
                password: body.password
            };
            console.log(user);
            res.render('pages/user/signup', {
                user,
                errors
            });
            console.log('Error');
            return;
        } else {  // normal processing here
            console.log('OK');

            const userExists = await UserModel.getUser(body.email);
            //console.log(userExists);
            if (userExists !== undefined) {
                // email already registered
                // error
                var user = {
                    name: body.name,
                    lastname: body.lastname,
                    email: body.email,
                    password: body.password
                };
                var errors = [];
                console.log(user);
                res.render('pages/user/signup', {
                    user,
                    errors
                });
            } else { // create new user
                const user = await UserModel.createUser(body);
                console.log(user);
                res.render('pages/user/login');
            }
        }
    }
}

const profilePage = (req, res) => {
    //console.log(req);
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
    logoutPage,
    signupPage,
    profilePage,
    getUsers
}