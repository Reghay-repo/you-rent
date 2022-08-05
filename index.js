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
const bookingsRoutes = require('./routes/bookings')
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
// session and flash config
const flash          = require('connect-flash');
const cookieParser   = require('cookie-parser');
const reviewsRoutes  = require('./routes/reviews');
const session        = require('express-session');
// set ejs as view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs',ejsMate )

const sessionConfig =  {
    secret:'thisisadamnsecret',
    resave:false,
    saveUninitialized:true,
    cookie: {
        httpOnly:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(cookieParser('secret'))
app.use(session(sessionConfig))
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


// connection to mongodb through mongoose
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/booking-app');
  console.log('connected to mongodb !')
}

app.use('/bookings', bookingsRoutes);
app.use('/bookings/:id/reviews', reviewsRoutes);
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