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
        }
    }]
})
RESOURCEschema.plugin(uniqueValidator);
const resources = mongoose.model('resource', RESOURCEschema);
module.exports = resources;