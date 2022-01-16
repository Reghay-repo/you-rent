const express       = require('express')
const mongoose      = require('mongoose')
const path          = require('path')
const port          = 3000
const app           = express()
const Booking       =require('./models/booking')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const { redirect } = require('express/lib/response')


// set ejs as view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs',ejsMate )

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

// connection to mongodb through mongoose
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/booking-app');
  console.log('connected to mongodb !')
}

// crud(create,read,update,delete)

//  read all data  
app.get('/bookings', async (req,res) => {
    const bookings = await Booking.find({})
    res.render('bookings/index', { bookings })      
})


//  create booking
app.get('/bookings/create', (req,res) => {
    res.render('bookings/create')      
})

// store data
app.post('/bookings', async (req,res) => {
    const { title,price,description,location} = req.body
    const newBooking = {title,price,location,description}
    const booking = new Booking(newBooking)
    await booking.save()
    res.redirect(`/bookings/${booking._id}`)
})


// view booking
app.get('/bookings/:id', async (req,res) => {
    const { id } = req.params
    const booking = await  Booking.findById(id)
    res.render('bookings/show', { booking })
})

// delete booking
app.delete('/bookings/:id',  async (req,res) => {
    const { id } = req.params
    const deletBooking = await Booking.findByIdAndRemove(id)
    res.redirect('/bookings')
})

// update booking
app.get('/bookings/:id/edit', async(req,res) => {
    const {id} = req.params
    const booking = await Booking.findById(id)
    res.render('bookings/edit', {booking})
})
// store update
app.put('/bookings/:id',  async (req, res) => {
    const {id} = req.params
    const updateBooking = await Booking.findByIdAndUpdate(id, req.body, {runValidators:true})
    res.redirect(`/bookings/${updateBooking._id}`)
})





// route to home
app.get('/', (req,res) => {
    res.render('home')
})


// setup server on port 3000
app.listen(port, () => {
    console.log(`serving your app on http://localhost:${port}`)
})