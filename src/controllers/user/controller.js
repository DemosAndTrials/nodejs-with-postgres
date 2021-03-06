import UserModel from '../../models/user';
import passport from 'passport';
import bcryptjs from 'bcryptjs';

/**
 * Navigate to login page
 */
const loginPage = async (req, res) => {
    console.log(req.param('err'));
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
    var user = body.user;
    // validation here
    req.checkBody("user.email", "Enter a valid email address.").isEmail();
    req.checkBody("user.password", "Password is required").notEmpty();

    var errors = req.validationErrors();
    console.log(errors);
    if (errors) {
        res.render('pages/user/login', {
            user,
            errors,
            userData : null
        });
    } else {
        // call passport authentication passing the "local" strategy name and a callback function
        passport.authenticate('local-signup', {
            //successRedirect: '/home',
            failureRedirect: '/user/login?err=notfound',
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
        const user = req.body.user;
        console.log(user);

        // validation here
        req.checkBody("user.name", "First Name is required").notEmpty();
        //req.checkBody("user.name", "First Name must be at least 2 characters").isLength({ min: 2 });
        req.checkBody("user.lastname", "Last Name is required").notEmpty();
        //req.checkBody("user.lastname", "First Name must be at least 2 characters").isLength({ min: 2 });
        req.checkBody("user.email", "Enter a valid email address.").isEmail();
        req.checkBody("user.password", "Password is required").notEmpty();
        req.checkBody("user.password", "Password must be at least 6 characters").isLength({ min: 6 });

        var errors = req.validationErrors();
        console.log(errors);
        if (errors) {;
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
            const userExists = await UserModel.getUser(user.email);
            console.log('userExists:' + userExists);
            if (userExists !== undefined) {
                // email already registered
                // error;
                var errors = [];
                errors.push({param: "inputEmail", msg: "Email address already registered", value: user.email});
                console.log(user);
                res.render('pages/user/signup', {
                    user,
                    errors : errors,
                    userData : null
                });
            } else { // create new user
                user.password = await bcryptjs.hash(user.password, 5);
                const savedUser = await UserModel.createUser(user);
                console.log(savedUser);
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