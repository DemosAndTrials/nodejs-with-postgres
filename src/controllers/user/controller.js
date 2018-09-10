import UserModel from './model';
import passport from 'passport';
import bcrypt from 'bcrypt';

const loginPage = async (req, res) => {
    if (req.isAuthenticated()) { // user already logged in, send to profile
        console.log(req.user);
        res.redirect('/user/profile', { userData: req.user });
    } else if (req.method === 'GET') {
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
        } else { // normal processing here
            console.log('OK');
            res.render('pages/home');
        }
    }
}

/**
 * Authenticate
 */
const authenticate = passport.authenticate('local-signup', {
    successRedirect: '/home',
    failureRedirect: '/user/login',
    failureFlash: true
})

const finalizeLogin = (req, res) => {
    console.log('finalizeLogin');
    if (req.body.remember) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
    } else {
        req.session.cookie.expires = false; // Cookie expires at end of session
    }
    //res.redirect('/');
    res.render('pages/home');
}

/**
 * Logout request
 * @param {*} req 
 * @param {*} res 
 */
const logoutPage = (req, res) => {
    console.log('isAuthenticated ' + req.isAuthenticated());
    req.logout();
    console.log('isAuthenticated ' + req.isAuthenticated());
    //req.flash('success', "Logged out. See you soon!");
    res.redirect('/');
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
        req.checkBody("password", "Password must be at least 6 characters").isLength({
            min: 6
        });

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
        } else { // normal processing here
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
                body.password = await bcrypt.hash(body.password, 5);
                const user = await UserModel.createUser(body);
                console.log(user);
                var errors = [];
                var user = {
                    email: '',
                    password: ''
                };
                res.render('pages/user/login', {
                    user,
                    errors
                });
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
    authenticate,
    finalizeLogin,
    logoutPage,
    signupPage,
    profilePage,
    getUsers
}