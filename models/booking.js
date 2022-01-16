const mongoose      = require('mongoose')
const { Schema }    = mongoose

// createing schema for a booking
const bookingSchema = Schema({
    title: String,
    description: String,
    price: Number,
    location:String,
    image:String
})



// creating model from our schema
const Booking = mongoose.model('Booking', bookingSchema)

// exporting our model
module.exports = Booking;



