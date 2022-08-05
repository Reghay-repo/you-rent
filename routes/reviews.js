const express       = require('express');
const router        = express.Router({mergeParams:true});
const wrapAsync     =require('../utils/wrapAsync')
const {reviewValidationSchema} = require('../validations/schemaValidations')
const Booking       = require('../models/booking')       
const Review        = require('../models/review')


// validating review
const validateReview = (req,res,next) => {
    const {error} = reviewValidationSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    } else {
        next()
    }
}

// Review Routes

// create a review
router.post('/',validateReview, wrapAsync(async(req,res) => {
    const booking = await Booking.findById(req.params.id);
    const review = new Review(req.body);
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