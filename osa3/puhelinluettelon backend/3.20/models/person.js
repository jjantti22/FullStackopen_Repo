require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url, { family: 4 })

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    mingLength: 8,
    required: true,
    validate: {
      validator:function(number) {
        const section = number.split('-')
        if(section.length > 2) return false
        if(section[0].length < 2 || section[0].length > 3) {
          return false
        }
        return true
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
})


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)