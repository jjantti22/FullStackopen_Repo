require('dotenv').config()
const express = require('express')
const morgan = require('morgan')

const app = express()

const Person = require('./models/person')

const PORT = process.env.PORT || 3001

app.use(express.json())

app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then((persons) => {
        response.json(persons);
    })
})

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body

  const person = new Person({
    name,
    number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

morgan.token('body', function(request, response) {
  return JSON.stringify(request.body)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})