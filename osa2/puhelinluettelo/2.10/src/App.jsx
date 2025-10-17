import { useState } from 'react'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Persons from './Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { 
      name: 'Arto Hellas', 
      phonenumber: '040-1231244'
    },
    { 
      name: 'kummitus', 
      phonenumber: '00000'
    }
  ]) 
  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)

    const newAddition = {
      name: newName,
      phonenumber: newPhoneNumber 
    }

    const names = persons.map(person => person.name)

    if(names.includes(newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    setPersons(persons.concat(newAddition))
    setNewName('')
    setNewPhoneNumber('') 
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
