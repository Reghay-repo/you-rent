const express       = require('express');
const passport       = require('passport');
const router         = express.Router();
const User          = require('../models/user');
const wrapAsync    = require('../utils/wrapAsync')
const {iLoggedIn} = require('../middleware');
const { redirect } = require('express/lib/response');
const UserController    = require('../controllers/UserController');





router.get('/register', UserController.renderRegister)
router.get('/login', UserController.renderLogin)
router.post('/register', wrapAsync(UserController.register))
router.get('/logout',UserController.logout)
router.post('/login', passport.authenticate('local', 
{
    failureFlash:true, 
    failureRedirect:"/login"
     ,keepSessionInfo: true
    
}),
    UserController.login)



module.exports = router;

