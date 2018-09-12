import UserModel from './model';
import passport from 'passport';
import bcryptjs from 'bcryptjs';

/**
 * Navigate to login page
 */
const loginPage = async (req, res) => {
    if (req.isAuthenticated()) { // user already logged in, send to profile
        console.log(req.user);
        res.redirect('/user/profile');
    } else {
        var user = {
            email: '',
            password: ''
        };
        res.render('pages/user/login', {
            user,
            errors: [],
            userData: null
        });
    } 
}

/**
 * Authenticate
 * wrap passport.authenticate call in a middleware function
 */
const login = (req, res, next) => {
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
            errors,
            userData : null
        });
    } else {
        // call passport authentication passing the "local" strategy name and a callback function
        passport.authenticate('local-signup', {
            //successRedirect: '/home',
            failureRedirect: '/user/login',
            failureFlash: true
        })(req, res, next);
    }
}

/**
 * Authentication callback, finalize login
 */
const finalizeLogin = (req, res) => {
    console.log('user logged in');
    if (req.body.remember) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
    } else {
        req.session.cookie.expires = false; // Cookie expires at end of session
    }
    res.redirect('/');
}

/**
 * Logout request
 */
const logoutPage = (req, res) => {
    console.log('isAuthenticated ' + req.isAuthenticated());
    req.logout();
    console.log('isAuthenticated ' + req.isAuthenticated());
    //req.flash('success', "Logged out. See you soon!");
    res.redirect('/');
}

/**
 * Navigate to signup page
 */
const signupPage = async (req, res) => {

    if (req.method === 'GET') {
        var user = {
            name: '',
            lastname: '',
            email: '',
            password: ''
        };
        res.render('pages/user/signup', {
            user,
            errors : [],
            userData : req.user
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
                errors,
                userData : null
            });
            console.log('Error');
            return;
        } else { // normal processing here
            console.log('OK');
            const userExists = await UserModel.getUser(body.email);
            console.log('userExists:' + userExists);
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
                errors.push({param: "inputEmail", msg: "Email address already registered", value: req.body.email});
                console.log(user);
                res.render('pages/user/signup', {
                    user,
                    errors : errors,
                    userData : null
                });
            } else { // create new user
                body.password = await bcryptjs.hash(body.password, 5);
                const user = await UserModel.createUser(body);
                console.log(user);
                res.redirect('/user/login');
            }
        }
    }
}

/**
 * Profile
 */
const profilePage = (req, res) => {
    res.render('pages/user/profile', {
        userData: req.user
    });
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
    login,
    finalizeLogin,
    logoutPage,
    signupPage,
    profilePage,
    getUsers,
}