require('dotenv').config()
const express = require('express')
const app = express()
const logger = require('morgan')
const cors = require('cors')
const Person = require('./models/Person')
// eslint-disable-next-line no-undef
const PORT = process.env.PORT


app.use(cors())
app.use(express.json())
app.use(logger('dev'))

const unknownPage = (_req, res) => {
    res.status(404).json(
        {error : 'Requested resource not found'}
    )
}

const errorHandler = (error, _request, response, next) => {
    console.log(error)

    if(error.name === 'CastError'){
        return response.status(400).json({
            error : 'malformatted Id'
        })
    } else if(error.name === 'ValidationError') {
        return response.status(400).json({error : error.message})
    }

    next(error)
}


app.get('/api/persons', (_request, response) => {
    Person.find({})
        .then(result => {
            return response.json(result)
        })

})

app.get('/api/info', (_request, response) => {

    const res = 'Phonebook has info for people' + '\n ' + new Date()
    response.send(res)
})

app.get('/api/persons/:id', (request, response, next) => {

    Person.findById(request.params.id)
        .then(result => {
            if(result){
                response.send(result)
            } else {
                response.status(404).send()
            }
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {

    const body = request.body

    const person = new Person({
        name : body.name,
        number : body.number
    })

    person.save()
        .then(savedPerson => {
            response.status(201).send(savedPerson)
        })
        .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {

    const person = {
        name : request.body.name,
        number : request.body.number
    }
    Person.findByIdAndUpdate(
        request.params.id,
        person,
        {new : true})
        .then(result => {
            if(result){
                response.json(result)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            next(error)
        })

})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Person.findByIdAndRemove(id)
        .then(() => {
            response.status(204).send()
        })
        .catch(error => next(error))
})

app.use(unknownPage)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})
