const express       = require('express');
const passport       = require('passport');
const router         = express.Router();
const User          = require('../models/user');
const wrapAsync    = require('../utils/wrapAsync')
const {iLoggedIn} = require('../middleware');
const { redirect } = require('express/lib/response');

router.get('/register', (req, res) => {
    res.render('auth/register')
})

router.get('/login', (req, res) => {
    res.render('auth/login')
})





router.post('/register', wrapAsync(async (req,res) => {
    try {
        const {email, username,password} = req.body
    const user = new User({email,username})
    const registerUser = await User.register(user,password)
    req.login(registerUser, err => {
        if(err) { return next(err)}
        req.flash('success', `Welcome to youRent ${registerUser.username}`)
        res.redirect('/bookings')
    })
    } catch(e) {
        req.flash('error', e.message)
        res.redirect('register')
    }
}))



router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect:"/login" ,keepSessionInfo: true}), (req,res) => {
    req.flash('success', 'Welcome back to YouRent !')
    const redirectUrl = req.session.returnTo || '/bookings'; 
    res.redirect(redirectUrl);
})


router.get('/logout', (req,res, next) => {
    req.logout(function (err) {
        if(err) {return next(err)}
        req.flash('success', 'You logged out successfully!');
        res.redirect('/bookings');
    });
    
})


module.exports = router;

