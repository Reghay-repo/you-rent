const express       = require('express')
const router        = express.Router();
const ExpressError = require('../utils/ExpressError')
const wrapAsync     =require('../utils/wrapAsync')
const Booking       = require('../models/booking')
const {bookingValidationSchema} = require('../validations/schemaValidations')

// validatung booking
const validatedBooking = (req, res, next) => {
    const {error} = bookingValidationSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    } else {
        next()
    }
}

// Booking Routes

//  read all data  
router.get('/', async (req,res) => {
    const bookings = await Booking.find({}).limit(30)
    res.render('bookings/index', { bookings })      
})


//  create booking
router.get('/create', (req,res) => {
    res.render('bookings/create')      
})

// store data
router.post('/',validatedBooking, wrapAsync(async (req,res,next) => {
    const { title,price,description,location} = req.body
    const newBooking = {title,price,location,description}
    const booking = new Booking(newBooking)
    await booking.save()
    res.redirect(`/bookings/${booking._id}`)
 
}))


// view booking
router.get('/:id', wrapAsync(async (req,res) => {
    const { id } = req.params
    const booking = await  Booking.findById(id).populate('reviews')
    res.render('bookings/show', { booking })
}))

// delete booking
router.delete('/:id',  async (req,res) => {
    const { id } = req.params
    const deletBooking = await Booking.findByIdAndDelete(id)
    res.redirect('/bookings')
})

// update booking
router.get('/:id/edit',wrapAsync( async(req,res) => {
    const {id} = req.params
    const booking = await Booking.findById(id)
    res.render('bookings/edit', {booking})
})

)
// store update
router.put('/:id', validatedBooking,  async (req, res) => {
    const {id} = req.params
    const updateBooking = await Booking.findByIdAndUpdate(id, req.body, {runValidators:true})
    res.redirect(`/bookings/${updateBooking._id}`)
})



module.exports = router;