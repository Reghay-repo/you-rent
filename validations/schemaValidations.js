const baseJoi = require('joi')
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type:'string',
    base:   joi.string(),
    messages: {
        'string.escapeHTML' : '{{#label}} must not include HTML',
    },
    rules: {
        escapeHTML: {
            validate(value,helpers) {
                const clean = sanitizeHtml(value, {
                    allowTags: [],
                    allowedAttributes: {},
                });
                if(clean !== value ) return helpers.error('string.escapeHTML', {value})
                return clean;
            }
        }
    }
})


const joi = baseJoi.extend(extension);



module.exports.bookingValidationSchema = joi.object({
    title: joi.string().required().escapeHTML(),
    price:joi.number().required().min(0),
    location: joi.string().required().escapeHTML(),
    description: joi.string().required().escapeHTML(),
    deleteImages: joi.array(),
    // image: joi.string().required()
    
}).required()



module.exports.reviewValidationSchema = joi.object({
    body: joi.string().required().escapeHTML(),
    rating: joi.number().required().min(1).max(5),

}).required()