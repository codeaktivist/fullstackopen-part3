const mongoose = require('mongoose')

const args = process.argv

if (args.length < 3) {
    console.log('Please provide password as 2nd argument.')
    process.exit(1)
} else if (args.length > 5) {
    console.log('Please use double quotes if name and/or number contains whitespace')
    process.exit(1)
}

const password = args[2]
const name = args[3]
const number = args[4]

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

mongoose.connect(`mongodb+srv://fullstack:${password}@fullstackopen.jjyauao.mongodb.net/phonebookApp?retryWrites=true&w=majority`)
    .then(() => {
        if (args.length === 3) {
            console.log('People in Phonebook:')
            Person.find({})
                .then((persons) => {
                    persons.forEach(person => {
                        console.log(person.name, person.number)
                    })
                    mongoose.connection.close()
                })
            return
        }

        const person = new Person({
            name:name,
            number:number
        })

        person.save()
            .then((response) => {
                console.log(`Added ${response.name} with number ${response.number} to phonebook`)
                mongoose.connection.close()
            })
    })
    .catch((err) => {
        console.log('Error!')
        console.error(err)
    })