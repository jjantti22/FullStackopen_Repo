const Persons = ({ persons }) => (
  <div>
    {persons.map(person =>
      <p key={person.name}>
        {person.name} {person.phonenumber}
      </p>
    )}
  </div>
)

export default Persons