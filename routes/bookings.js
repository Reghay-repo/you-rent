const express       = require('express')
const router        = express.Router();
const ExpressError = require('../utils/ExpressError')
const wrapAsync     =require('../utils/wrapAsync')
const Booking       = require('../models/booking')
const {isLoggedIn}  = require('../middleware')
const {bookingValidationSchema} = require('../validations/schemaValidations')
const {isAuthor, validatedBooking}  =require('../middleware')

// Booking Routes
//  read all data  
router.get('/', async (req,res) => {
    const bookings = await Booking.find({}).limit(30)
    res.render('bookings/index', { bookings })      
})


//  create booking
router.get('/create',  isLoggedIn ,(req,res) => {
 
    res.render('bookings/create')      
})

// store data
router.post('/',validatedBooking, wrapAsync(async (req,res,next) => {
    const { title,price,description,location} = req.body;
    const newBooking = {title,price,location,description};
    const booking = new Booking(newBooking);
    booking.author = req.user._id;
    await booking.save();
    req.flash('success', 'Booking created Successfully!');
    res.redirect(`/bookings/${booking._id}`);
 
}))


// view booking
router.get('/:id', wrapAsync(async (req,res) => {
    const { id } = req.params
    const booking = await  Booking.findById(id)
    .populate({
        path:'reviews',
        populate: {
            path:'author'
        }
    })
    .populate('author');
    console.log(booking);
    if(!booking) {
        req.flash('error','Cannot find that booking.')
        res.redirect('/bookings')
    } else {
        res.render('bookings/show', { booking })
    }
}))

// delete booking
router.delete('/:id',isAuthor,  async (req,res) => {
    const { id } = req.params
    const deletBooking = await Booking.findByIdAndDelete(id)
    res.redirect('/bookings')
})

// update booking
router.get('/:id/edit',  isLoggedIn,isAuthor, wrapAsync( async(req,res) => {
    const {id} = req.params
    const booking = await Booking.findById(id)
    if(!booking) {
        req.flash('error','Cannot find that booking.')
        res.redirect('/bookings')
    } else {

        res.render('bookings/edit', {booking})
    }
})

)
// store update
router.put('/:id', validatedBooking, isAuthor, async (req, res) => {
    const {id} = req.params;
    //find the booking by id 
    const booking =  await Booking.findById(id);

    const updateBooking = await Booking.findByIdAndUpdate(id, req.body, {runValidators:true})
    req.flash('success', 'Booking updated Successfully!')
    res.redirect(`/bookings/${updateBooking._id}`)
})



module.exports = router;