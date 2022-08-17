const express       = require('express');
const router        = express.Router({mergeParams:true});
const wrapAsync     =require('../utils/wrapAsync')
const Booking       = require('../models/booking')  
const {isLoggedIn}  =require('../middleware')     
const Review            = require('../models/review')
const {validateReview}  = require('../middleware')
const ReviewController  = require('../controllers/ReviewController')


router.post('/',validateReview,  isLoggedIn , wrapAsync(ReviewController.store));
router.delete('/:reviewId', wrapAsync(ReviewController.delete));

module.exports = router;