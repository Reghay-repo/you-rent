const mongoose = require('mongoose');
const { Schema }    = mongoose

const reviewSchema = Schema({
    body:String,
    rating:Number,
});




const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;