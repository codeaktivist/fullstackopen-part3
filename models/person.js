const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose.connect(url)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch(err => {
        console.log('Connection to DB failed: ', err.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, 'The name {VALUE} is too short'],
        maxLength: [10, 'The name {VALUE} is too long'],
        required: true
    },
    number: {
        type: String,
        minLength: [8, 'Phone number must be 8 digits or more'],
        validate: {
            validator: (v) => {
                return /\d{2,3}-\d{6,}/.test(v)
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)