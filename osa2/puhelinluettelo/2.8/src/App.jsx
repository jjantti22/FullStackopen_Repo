import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { 
      name: 'Arto Hellas', 
      phonenumber: '040-1231244'
    }
  ]) 
  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')

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

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handlePhoneNumberChange = (event) => {
    setNewPhoneNumber(event.target.value)
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>name: <input value={newName}onChange={handleNameChange} /></div>
        <div>number: <input value={newPhoneNumber}onChange={handlePhoneNumberChange}/></div>
        <div><button type="submit">add</button></div>
      </form>
      <h2>Numbers</h2>
        {persons.map(person => 
          <p key={person.name}>{person.name} {person.phonenumber}</p>
        )}
 
    </div>
  )

}

export default App
