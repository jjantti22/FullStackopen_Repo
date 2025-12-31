const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const personName = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://jjantti22:${password}@cluster0.wau5jj8.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  personName: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    personName,
    number,
})


if(process.argv.length === 3){
    Person.find({}).then(result => {
        console.log('phonebook:')  
        result.forEach(person => {
            console.log(person.personName, person.number)
    })
    mongoose.connection.close()
    })
}
else {
    person.save().then(result => {
        console.log(`added ${personName} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}
