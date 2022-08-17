const Booking       = require('../models/booking')

// index
module.exports.index = async (req,res) =>  {
    const bookings = await Booking.find({}).limit(30)
    res.render('bookings/index', { bookings })      
}

// create
module.exports.create = (req,res) => {
    res.render('bookings/create')      
}

// store
module.exports.store = async (req,res,next) => {
    const { title,price,description,location} = req.body;
    const newBooking = {title,price,location,description};
    const booking = new Booking(newBooking);
    booking.author = req.user._id;
    await booking.save();
    req.flash('success', 'Booking created Successfully!');
    res.redirect(`/bookings/${booking._id}`);
}

// show
module.exports.show = async (req,res) => {
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
}

// delete
module.exports.delete = async (req,res) => {
    const { id } = req.params
    const deletBooking = await Booking.findByIdAndDelete(id)
    res.redirect('/bookings')
}

// edit
module.exports.edit = async(req,res) => {
    const {id} = req.params
    const booking = await Booking.findById(id)
    if(!booking) {
        req.flash('error','Cannot find that booking.')
        res.redirect('/bookings')
    } else {

        res.render('bookings/edit', {booking})
    }
}

// update
module.exports.update = async (req, res) => {
    const {id} = req.params;
    //find the booking by id 
    const booking =  await Booking.findById(id);

    const updateBooking = await Booking.findByIdAndUpdate(id, req.body, {runValidators:true})
    req.flash('success', 'Booking updated Successfully!')
    res.redirect(`/bookings/${updateBooking._id}`)
}