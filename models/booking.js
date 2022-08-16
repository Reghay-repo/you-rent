const mongoose      = require('mongoose')
const { Schema }    = mongoose
const Review        = require('./review')

// createing schema for a booking
const bookingSchema = Schema({
    title: String,
    description: String,
    price:Number,
    location:String,
    image:String,
    author: {
        type:Schema.Types.ObjectId,
        ref:'User',
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})


bookingSchema.post('findOneAndDelete', async (doc) => {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


// creating model from our schema
const Booking = mongoose.model('Booking', bookingSchema)

// exporting our model
module.exports = Booking;



