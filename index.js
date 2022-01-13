const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 3000



app.get('/', (req,res) => {
    res.send('welcome to youRent')
})



app.listen(port, () => {
    console.log(`serving your app on http://localhost:${port}`)
})