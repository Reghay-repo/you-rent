const User      = require('../models/user')


module.exports.renderRegister =  (req, res) => {
    res.render('auth/register')
}

module.exports.renderLogin = (req, res) => {
    res.render('auth/login')
}

module.exports.register = async (req,res) => {
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
}

module.exports.login = (req,res) => {
    req.flash('success', 'Welcome back to YouRent !')
    const redirectUrl = req.session.returnTo || '/bookings'; 
    res.redirect(redirectUrl);
}

module.exports.logout =  (req,res, next) => {
    req.logout(function (err) {
        if(err) {return next(err)}
        req.flash('success', 'You logged out successfully!');
        res.redirect('/bookings');
    });
    
}