require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()
app.use(express.static('build'))
app.use(express.json())
app.use(morgan((tokens, request, response) => {
    return [
        tokens.method(request, response),
        tokens.url(request, response),
        tokens.status(request, response),
        tokens.res(request, response, 'content-length'), '-',
        tokens['response-time'](request, response), 'ms',
        JSON.stringify(request.body)
    ].join(' ')
}))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
        response.json(result)
    })
})

app.get('/api/info', (request, response) => {
    Person.find({})
        .then(result => {
            response.send(
                `Phonebook has ${result.length} entries<br>${new Date}`
            )
        })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(result => {
            if (result) {
                console.log('Showing info for ', result.name)
                response.json(result)
            } else {
                console.log('Person does not exist')
                response.status(404).end()
            }
        })
        .catch(err => next(err))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            if (result) {
                console.log('Removed: ', result)
                response.json(result)
            } else {
                console.log('Person for removal not found')
                response.json({ error: 'person for deletion not found'})
            }
        })
        .catch(err => next(err))
})

app.post('/api/persons', (request, response) => {
    const person = request.body
    if (!person.name) {
        console.log(`Name not provided with post`);
        response.status(400).json({'error': 'Please provide name'})
    } else if (!person.number) {
        console.log(`Number not provided with post`);
        response.status(400).json({'error': 'Please provide number'})
    } else {
        const newPerson = new Person({
            name: person.name,
            number: person.number
        })
        newPerson.save()
            .then(result => {
                console.log(`Person added: `, result)
                response.json(newPerson)
            })
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})