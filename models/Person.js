const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI

console.log('connecting to ', url)

mongoose.connect(url)
.then(result => {
    console.log('connection successful')
})
.catch(err => {
    console.log(err.message)
})


const PersonSchema = new mongoose.Schema({
    name: String,
    number : Number
})

PersonSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', PersonSchema)


module.exports = Person

