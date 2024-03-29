if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


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
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
// session and flash config
const flash          = require('connect-flash');
const cookieParser   = require('cookie-parser');
const userRoutes     = require('./routes/users')
const bookingsRoutes = require('./routes/bookings')
const reviewsRoutes  = require('./routes/reviews');
const helmet        = require('helmet');

const session        = require('express-session');
const User           = require('./models/user')
const passport       = require('passport');
const LocalStrategy  = require('passport-local')
const mongoSanitize = require('express-mongo-sanitize');
// set ejs as view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs',ejsMate )

const sessionConfig =  {
    name:'session',
    secret:'thisisadamnsecret',
    resave:false,
    saveUninitialized:true,
    cookie: {
        httpOnly:true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(cookieParser('secret'))
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(mongoSanitize());

// helmet security options

// app.use(helmet.contentSecurityPolicy());
// app.use(helmet.crossOriginEmbedderPolicy());
// app.use(helmet.crossOriginOpenerPolicy());
app.use(helmet.crossOriginResourcePolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

// save flash messages to locals
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get('/fakeuser', async (req, res) => {
    const user = new User({email: 'oussama2@gmail.com', username: 'oussama2'})
    const newUser = await User.register(user, 'password')
    res.send(newUser)
})





// connection to mongodb through mongoose
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/booking-app');
  console.log('connected to mongodb !')
}

app.use('/bookings', bookingsRoutes);
app.use('/bookings/:id/reviews', reviewsRoutes);
app.use('/', userRoutes)
// route to home
app.get('/', (req,res) => {
    res.render('home')
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