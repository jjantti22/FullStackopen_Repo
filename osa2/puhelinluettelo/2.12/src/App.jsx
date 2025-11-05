import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Persons from './Persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [filter, setFilter] = useState('')


  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled', response.data)
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'persons')



  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)

    const newAddition = {
      name: newName,
      number: newPhoneNumber,
    }

    const names = persons.map(person => person.name)

    if(names.includes(newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    axios
      .post('http://localhost:3001/persons', newAddition)
      .then(response => {
        console.log("response", response.data)
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewPhoneNumber('') 
      })
  }

  const handlePhoneNumberChange = (event) => {
    setNewPhoneNumber(event.target.value)
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const showthesepeople = persons.filter(person => {
    const allnames = person.name.toLowerCase()
    const filteredNames = filter.toLowerCase()
    if(allnames.includes(filteredNames)){
      return allnames
    }
  })
  
  return (
    <div>
      <h2>Phonebook</h2>
        <Filter filter={filter} setFilter={setFilter} />
      <h2>add a new</h2>
        <PersonForm 
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newPhoneNumber={newPhoneNumber}
        handlePhoneNumberChange={handlePhoneNumberChange}
        />
      <h2>Numbers</h2>
      <Persons persons={showthesepeople} />
 
    </div>
  )

}

export default App
