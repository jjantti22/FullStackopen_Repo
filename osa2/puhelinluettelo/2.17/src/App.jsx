import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)



  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        console.log('promise fulfilled', response)
        setPersons(response)
      })
      .catch(error => {
        setErrorMessage('Failure to get persons from host')
        setTimeout(() => setErrorMessage(null), 5000)
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

    const person = persons.find(person => {
      return person.name === newName
    })
  

    if(person) {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const replacedPerson = {...person, number: newPhoneNumber }
        personService
          .update(person.id, replacedPerson)
          .then(response => {
            setPersons(persons.map(person => person.id !== newName.id ? person : response))
            setNewName('')
            setNewPhoneNumber('')
            setSuccessMessage(`UPdated ${response.name}`)
            setTimeout(() => setSuccessMessage(null), 5000)
          })
          .catch(error => {
            setErrorMessage(`Information of ${newName} has already been removed from server`)
            setTimeout(() => setErrorMessage(null), 5000)
          })
      }
    }
    else {
      personService
      .create(newAddition)
      .then(response => {
        console.log("response", response)
        setPersons(persons.concat(response))
        setNewName('')
        setNewPhoneNumber('') 
        setSuccessMessage(`Added ${response.name}`)
        setTimeout(() => setSuccessMessage(null), 5000)
      })
      .catch(error => {
          //setErrorMessage(`Failure in adding ${newAddition.name}`)
          setErrorMessage(error.response.data.error)
          setTimeout(() => setErrorMessage(null), 5000)
      })
    }


  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setSuccessMessage(`Deleted ${name}`)
          setTimeout(() => setSuccessMessage(null), 5000)
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
        <Notification message={successMessage} typeOfMessage={"success"}/>
        <Notification message={errorMessage} typeOfMessage={"error"}/>
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
