const joi = require('joi')


module.exports.bookingValidationSchema = joi.object({
    title: joi.string().required(),
    price:joi.number().required().min(0),
    location: joi.string().required(),
    description: joi.string().required(),
    image: joi.string().required()
    
}).required()



module.exports.reviewValidationSchema = joi.object({
    body: joi.string().required(),
    rating: joi.number().required().min(1).max(5),

}).required()