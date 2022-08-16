const passportLocalMongoose         =    require('passport-local-mongoose');
const mongoose                      =    require('mongoose')
const Schema                        =    mongoose.Schema;


const userSchema        = new Schema({
    email: {
        type:String,
        required:true,
        unique:true
    }
})

// use passportLocalMongoose plugin in user model
mongoose.plugin(passportLocalMongoose)

// create user model
const User = mongoose.model('User', userSchema)

// export use model
module.exports = User;