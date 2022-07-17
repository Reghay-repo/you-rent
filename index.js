const express       = require('express')
const mongoose      = require('mongoose')
const path          = require('path')
const port          = 3000
const app           = express()
const Booking       = require('./models/booking')
const Review        = require('./models/review')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const { redirect } = require('express/lib/response')
const ExpressError = require('./utils/ExpressError')
const wrapAsync     =require('./utils/wrapAsync')
const joi = require('joi')
const {bookingValidationSchema,reviewValidationSchema} = require('./validations/schemaValidations')






// set ejs as view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs',ejsMate )
app.use(express.static('public'));

// app.use('/static', express.static(path.join(__dirname, 'public')))
//use static files



// app.use("views", express.static(path.join(__dirname, "public"))); //  "public" off of current is root

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

// connection to mongodb through mongoose
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/booking-app');
  console.log('connected to mongodb !')
}

const validatedBooking = (req, res, next) => {
    const {error} = bookingValidationSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    } else {
        next()
    }
}

const validateReview = (req,res,next) => {
    const {error} = reviewValidationSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    } else {
        next()
    }
}


//  read all data  
app.get('/bookings', async (req,res) => {
    const bookings = await Booking.find({}).limit(30)
    res.render('bookings/index', { bookings })      
})


//  create booking
app.get('/bookings/create', (req,res) => {
    res.render('bookings/create')      
})

// store data
app.post('/bookings',validatedBooking, wrapAsync(async (req,res,next) => {
    const { title,price,description,location} = req.body
    const newBooking = {title,price,location,description}
    const booking = new Booking(newBooking)
    await booking.save()
    res.redirect(`/bookings/${booking._id}`)
 
}))


// view booking
app.get('/bookings/:id', wrapAsync(async (req,res) => {
    const { id } = req.params
    const booking = await  Booking.findById(id).populate('reviews')
    res.render('bookings/show', { booking })
}))

// delete booking
app.delete('/bookings/:id',  async (req,res) => {
    const { id } = req.params
    const deletBooking = await Booking.findByIdAndDelete(id)
    res.redirect('/bookings')
})

// update booking
app.get('/bookings/:id/edit',wrapAsync( async(req,res) => {
    const {id} = req.params
    const booking = await Booking.findById(id)
    res.render('bookings/edit', {booking})
})

)
// store update
app.put('/bookings/:id', validatedBooking,  async (req, res) => {
    const {id} = req.params
    const updateBooking = await Booking.findByIdAndUpdate(id, req.body, {runValidators:true})
    res.redirect(`/bookings/${updateBooking._id}`)
})

// create a review
app.post('/bookings/:id/reviews',validateReview, wrapAsync(async(req,res) => {
    const booking = await Booking.findById(req.params.id);
    const review = new Review(req.body);
    booking.reviews.push(review);
    await booking.save();
    await review.save();
    return res.redirect(`/bookings/${booking._id}`);
}));

// delete review
app.delete('/bookings/:id/reviews/:reviewId', wrapAsync(async (req,res) => {
    const {id, reviewId} = req.params
    await Booking.findByIdAndUpdate(id,{$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/bookings/${id}`);
}))


// route to home
app.get('/', (req,res) => {
    res.render('home')
})

// auth routes
app.get('/login', (req,res) => {
    res.render('auth/login')
})

app.get('/register', (req,res) => {
    res.render('auth/register')
})


app.get('/about', (req,res) => {
    res.render('about')
})

app.all('*', (req, res,next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req ,res, next) => {
    const {status = 500} = err
    if(! err.message) err.message = 'something went wrong!'
     res.status(status).render('error', {err,status})
})


// setup server on port 3000
app.listen(port, () => {
    console.log(`serving your app on http://localhost:${port}`)
})