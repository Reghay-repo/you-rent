const mongoose = require('mongoose')
const Booking = require('../models/booking')
const cities = require('./cities')
const  { places, descriptors } = require('./seedHelpers')


// connecting to db
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/booking-app');
  console.log('connected to mongodb !')
}


const sample = array => array[Math.floor(Math.random() * array.length)];

const randomPrice = () => Math.floor(Math.random() * 500) 

// seeding data in db
const seedDB = async () => {
    await Booking.deleteMany({})

    for(let i= 0; i <=  300; i++ ) 
    {
        const randomnum = Math.floor(Math.random() * 1300)
        const booking = new Booking({
            location: `${cities[randomnum].country}, ${cities[randomnum].name}`,
            title: `${sample(places)} ${sample(descriptors)}`,
            price : randomPrice(),
            image: 'https://source.unsplash.com/1600x900/?interiors',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione, earum voluptas aliquid magni qui impedit quasi, labore magnam expedita odit, corrupti voluptate ipsam quidem quas error illum explicabo velit accusamus.'
        })
        await booking.save()
    }

} 


seedDB().then(() => {
    mongoose.connection.close()
})   