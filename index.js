const express       = require('express')
const mongoose      = require('mongoose')
const path          = require('path')
const port          = 3000
const app           = express()
const Booking       =require('./models/booking')
// connection to mongodb through mongoose
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/booking-app');
  console.log('connected to mongodb !')
}


// bookings page
app.get('/bookings', async (req,res) => {
    const booking = new Booking({title: 'residence omar', price:3000,description:'something', location:'tanger beni makada'})
    await booking.save()
    res.send(booking)        
})


// set ejs as view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))



// route to home
app.get('/', (req,res) => {
    res.send('welcome to youRent')
})


// setup server on port 3000
app.listen(port, () => {
    console.log(`serving your app on http://localhost:${port}`)
})