/* eslint-disable no-undef */
const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
} else if(process.argv.length > 3){
    if(process.argv.length == 4) {
        console.log('Please provide the name of person whose number you want to save')
        process.exit(1)
    } else if (process.argv.length < 5) {
        console.log('Please provide the number you want to save')
        process.exit(1)
    }
}



const password = process.argv[2]
const input_person = process.argv[3]
const input_number = Number(process.argv[4])

const url =
    `mongodb+srv://natborks:${password}@cluster0.qknxt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`


mongoose.connect(url).then(() => {
    console.log('connection successful')
}).catch(err => {
    console.log(err)
    process.exit(1)
})


const PersonSchema = new mongoose.Schema({
    name: String,
    number : Number
})

const Person = mongoose.model('Person', PersonSchema)

if(!(input_person && input_number)){
    Person.find({})
        .then(result => {
            displayResult(result)
            mongoose.connection.close()
        })
} else {
    const person = new Person({
        name : input_person,
        number : input_number
    })

    person.save().then(() => {
        console.log(`Person saved: ${input_person}, ${input_number}`)
        mongoose.connection.close()
    })
}

function displayResult(arr){
    arr.forEach(element => {
        console.log(element.name + ' ' + element.number)
    })
}

