const express = require('express')
const app = express()
app.use(express.json())

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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
