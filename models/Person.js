const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
mongoose.set('runValidators', true)
require('dotenv').config()

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI

console.log('connecting to ', url)

mongoose.connect(url)
    .then(() => {
        console.log('connection successful')
    })
    .catch(err => {
        console.log(err.message)
    })


const PersonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    number : {
        type: Number,
        required: true,
        unique: true
    }
})
PersonSchema.plugin(uniqueValidator)

PersonSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', PersonSchema)


module.exports = Person

