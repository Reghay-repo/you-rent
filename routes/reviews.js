const express       = require('express');
const router        = express.Router({mergeParams:true});
const wrapAsync     =require('../utils/wrapAsync')
const Booking       = require('../models/booking')  
const {isLoggedIn}  =require('../middleware')     
const Review        = require('../models/review')
const {validateReview} =require('../middleware')



// Review Routes

// create a review
router.post('/',validateReview,  isLoggedIn , wrapAsync(async(req,res) => {
    const booking = await Booking.findById(req.params.id);
    const review = new Review(req.body);
    review.author = req.user._id;
    booking.reviews.push(review);
    await booking.save();
    await review.save();
    req.flash('success', 'Review created successfully!')
    return res.redirect(`/bookings/${booking._id}`);
}));

// delete review
router.delete('/:reviewId', wrapAsync(async (req,res) => {
    const {id, reviewId} = req.params
    await Booking.findByIdAndUpdate(id,{$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/bookings/${id}`);
}))



module.exports = router;