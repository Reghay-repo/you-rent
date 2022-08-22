const express       = require('express')
const router        = express.Router();
const ExpressError = require('../utils/ExpressError')
const wrapAsync     =require('../utils/wrapAsync')
const Booking       = require('../models/booking')
const BookingController         = require('../controllers/BookingController')
const {bookingValidationSchema} = require('../validations/schemaValidations')
const {isLoggedIn,isAuthor, validatedBooking}  =require('../middleware')
const multer  = require('multer')
const {storage}  = require('../cloudinary')

const upload = multer({ storage })

// router.get('/', wrapAsync(BookingController.index));
// router.post('/',validatedBooking, wrapAsync(BookingController.store));


router.route('/')
    .get(wrapAsync(BookingController.index))
    .post(isLoggedIn,upload.array('image'),validatedBooking, wrapAsync(BookingController.store));


router.get('/create', isLoggedIn, BookingController.create);
router.get('/:id/edit',  isLoggedIn,isAuthor, wrapAsync(BookingController.edit))

router.route('/:id')
    .get(wrapAsync(BookingController.show))
    .delete(isAuthor, wrapAsync(BookingController.delete))
    .put(upload.array('image'), validatedBooking, isAuthor, wrapAsync(BookingController.update))



module.exports = router;