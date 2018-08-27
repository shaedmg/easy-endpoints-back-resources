const mongoose = require ('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const RESOURCEschema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    params: [{
        name: {
            type:String,
            required: true
        },
        model: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        required : {
            type: Boolean,
            required: true
        }, 
        unique: {
            type: Boolean,
            required: true
        }
    }],
    url: String
})
RESOURCEschema.plugin(uniqueValidator);
const resources = mongoose.model('resource', RESOURCEschema);
module.exports = resources;