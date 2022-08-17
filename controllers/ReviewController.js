const Review        = require('../models/review');
const Booking       = require('../models/booking')




module.exports.store = async(req,res) => {
    const booking = await Booking.findById(req.params.id);
    const review = new Review(req.body);
    review.author = req.user._id;
    booking.reviews.push(review);
    await booking.save();
    await review.save();
    req.flash('success', 'Review created successfully!')
    return res.redirect(`/bookings/${booking._id}`);
}

module.exports.delete = async (req,res) => {
    const {id, reviewId} = req.params
    await Booking.findByIdAndUpdate(id,{$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/bookings/${id}`);
}