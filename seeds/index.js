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

    for(let i= 0; i <=  200; i++ ) 
    {
        const randomnum = Math.floor(Math.random() * 1300)
        const booking = new Booking({
            author:'62f7da0821b4b559b4a0685b',
            location: `${cities[randomnum].country}, ${cities[randomnum].name}`,
            title: `${sample(places)} ${sample(descriptors)}`,
            geometry: { type: 'Point', coordinates: [
                cities[randomnum].lng,
                cities[randomnum].lat,
            ] },
            price : randomPrice(),
            images: [
                {
                    url: 'https://res.cloudinary.com/dejfsqbcs/image/upload/v1660753644/YouRent/mrkweetmnf0chd8nvl2l.jpg',
                    filename: 'YouRent/mrkweetmnf0chd8nvl2l',
                  },
                  {
                    url: 'https://res.cloudinary.com/dejfsqbcs/image/upload/v1660753644/YouRent/wss6habpq8qa9snpquuw.jpg',
                    filename: 'YouRent/wss6habpq8qa9snpquuw',
                  },
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione, earum voluptas aliquid magni qui impedit quasi, labore magnam expedita odit, corrupti voluptate ipsam quidem quas error illum explicabo velit accusamus.'
        })
        await booking.save()
    }

} 


seedDB().then(() => {
    mongoose.connection.close()
})   








// [1 item
//     0:{23 items
//     "addressLine1":"5500 Grand Lake Dr"
//     "city":"San Antonio"
//     "state":"TX"
//     "zipCode":"78244"
//     "formattedAddress":"5500 Grand Lake Dr, San Antonio, TX 78244"
//     "assessorID":"05076-103-0500"
//     "bedrooms":3
//     "county":"Bexar"
//     "legalDescription":"CB 5076A BLK 3 LOT 50"
//     "squareFootage":1878
//     "subdivision":"CONV A/S CODE"
//     "yearBuilt":1973
//     "bathrooms":2
//     "lotSize":8843
//     "propertyType":"Single Family"
//     "lastSaleDate":"2017-10-19T00:00:00.000Z"
//     "features":{...}14 items
//     "taxAssessment":{...}4 items
//     "propertyTaxes":{...}2 items
//     "owner":{...}2 items
//     "id":"5500-Grand-Lake-Dr,-San-Antonio,-TX-78244"
//     "longitude":-98.351442
//     "latitude":29.475962
//     }
//     ]