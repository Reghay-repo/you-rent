const mongoose      = require('mongoose')
const { Schema }    = mongoose
const Review        = require('./review')

// createing schema for a booking

const opts = { toJSON : { virtuals: true } } 


const imageSchema = new Schema ({
        url:String,
        filename:String,
})

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200')
})
const bookingSchema = Schema({
    title: String,
    description: String,
    geometry: {
        type: {
            type:String,
            enum:['Point'],
            required:true,
        },
        coordinates: {
            type:[Number],
            required:true,
        }
    },
    price:Number,
    location:String,
    images:[imageSchema],
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
},opts);


bookingSchema.virtual("properties.popUpMarkup").get(function() {
    return `<strong><a href="/bookings/${this._id}">${this.title}</a></strong>
            <p>${this.description.substring(0,20)}...</p>`;
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



