const Booking = require('./models/booking')
const  ExpressError = require('./utils/ExpressError')
const {bookingValidationSchema, reviewValidationSchema} = require('./validations/schemaValidations')

module.exports = {
    isLoggedIn :   (req,res,next) => {
        if(!req.isAuthenticated()) {
            req.session.returnTo = req.originalUrl;
            req.flash('error', 'you must be logged in ')
            return res.redirect('/login')
        }
        next();
    }
    
}




// validatung booking
module.exports.validatedBooking = (req, res, next) => {
    const {error} = bookingValidationSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    } else {
        next()
    }
}


// check if author is logged in user
module.exports.isAuthor = async (req,res,next) => {
    const {id} = req.params
    const booking = await Booking.findById(id)
    if(!booking.author.equals(req.user._id)) {
        req.flash('error', 'you do not have permission to update this booking');
        return   res.redirect(`/bookings/${booking._id}`);
    }
    next();
}



// validating review
module.exports.validateReview = (req,res,next) => {
    const {error} = reviewValidationSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    } else {
        next()
    }
}