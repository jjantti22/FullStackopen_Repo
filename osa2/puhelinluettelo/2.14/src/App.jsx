import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [filter, setFilter] = useState('')


  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        console.log('promise fulfilled', response)
        setPersons(response)
      })
      .catch(error => { console.log ("fail :(")})
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

    personService
      .create(newAddition)
      .then(response => {
        console.log("response", response)
        setPersons(persons.concat(response))
        setNewName('')
        setNewPhoneNumber('') 
      })
      .catch(error => { console.log ("fail :(")})
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          alert(`'${name}' was already deleted from the server`)
          setPersons(persons.filter(person => person.id !== id))
        })
    }
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
      <Persons persons={showthesepeople} deletePerson={deletePerson}/>
 
    </div>
  )

}

export default App
