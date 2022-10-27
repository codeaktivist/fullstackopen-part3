const express = require('express')
const morgan = require('morgan')
// const cors = require('cors')

const app = express()
// app.use(cors())
app.use(express.json())
app.use(morgan((tokens, request, response) => {
    return [
        'CUSTOM',
        tokens.method(request, response),
        tokens.url(request, response),
        tokens.status(request, response),
        tokens.res(request, response, 'content-length'), '-',
        tokens['response-time'](request, response), 'ms',
        JSON.stringify(request.body)
    ].join(' ')
}))


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

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/info', (request, response) => {
    const count = persons.length
    response.send(
        `Phonebook has ${count} entries<br>${new Date}`
    )
})

app.get('/api/persons/:id', (request, response) => { 
    console.log(request.params.id);
    const person = persons.find(person => person.id === Number(request.params.id))
    if (person) {
        console.log(`looking for ${person.name}`)
        response.json(person)
    } else {
        console.log(`Person not found`);
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const person = persons.find(person => person.id === Number(request.params.id))
    if (person) {
        console.log(`Deleting Id ${request.params.id}`)
        response.json(person)
        persons = persons.filter(person => person.id !== Number(request.params.id))
    } else {
        console.log(`Person for deletion not found`)
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const person = request.body
    if (!person.name) {
        console.log(`Name not provided with post`);
        response.status(400).json({'error': 'Please provide name'})
    } else if (!person.number) {
        console.log(`Number not provided with post`);
        response.status(400).json({'error': 'Please provide number'})
    } else if (persons.find(p => p.number === person.number)) {
        console.log(`Duplicate Number`)
        response.status(400).json({'error': 'Provided number already exists'})
    } else {
        const id = Math.floor(Math.random() * 9999)
        console.log(`Adding person`, person)
        persons = persons.concat({id: id, ...person})
        response.json(persons.find(p => p.id === Number(id)))
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
