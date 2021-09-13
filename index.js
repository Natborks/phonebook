const { request, response } = require('express')
const express = require('express')
const app = express()
const logger = require('morgan')
const cors = require('cors')
const PORT = process.env.PORT || 3001

let persons = [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]
app.use(cors())
app.use(express.json())
app.use(logger('dev'))

function findPerson(request) {
    const id = Number(request.params.id)

    const person = persons.find( person => person.id === id)

    return person
}

function generateId() {
    const max_id = Math.floor(Math.random * 1000)

    const id = max_id + 1;

    return id;
}

function findPersonbyName(name) {
    return persons.find(person => person.name === name)
}
function removePersonFromList(person) {
    persons = persons.filter(each => each.id !== person.id)
}

app.get('/api/persons', (request, response, next) => {
    return response.json(persons)
})

app.get('/api/info', (request, response, next) => {
    const res = `Phonebook has info for ${persons.length} people` + '\n ' + new Date()
    response.send(res);
})

app.get('/api/persons/:id', (request, response, next) => {

    const person  = findPerson(request)

    if(person) {
        response.json(person)
    } else {
        response.status(404).send()
    }
})

app.post('/api/persons', (request, response, next) => {

    const id = generateId()

    const body = request.body

    if(body.name && body.number) {
        const person = findPersonbyName(body.name)

        if(person) {
            response.status(400).json(
                { error : `person ${person.name} already exists in phonebook`}
            )
        }
        // person creation logic should not be in this method
        const newPerson = {
            id : id,
            name : body.name,
            number : body.number
        }

        persons.push(newPerson)

        response.status(201).send()
    } else {
        response.status(400).json(
            {error : "missing body or number"}
        )
    }



})

app.delete('/api/persons/:id', (request, response, next) => {
    const person = findPerson(request)

    if(person){
        removePersonFromList(person)

        response.status(204).send()
    } else {
        response.status(404).send()
    }
})

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})
