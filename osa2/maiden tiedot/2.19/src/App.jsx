import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [currentCountry, setCurrentCountry] = useState(null)

  useEffect(() => {
    console.log("getting countries...")
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
      .catch(error => {
        console.error('Fail :(', error)
      })
  }, [])
  useEffect(() => {setCurrentCountry(null)}, [search])

  const handleChange = (event) => {
    setSearch(event.target.value)
    setCurrentCountry(null)
  }

  const filteredCountries = countries.filter((country) => {
    const countryName = country.name.common.toLowerCase()
    const searchTerm  = search.toLowerCase()
    return countryName.includes(searchTerm)
  })

  const tooMany = () => <p>Too many matches, specify another filter</p>

  const countryList = () => {
    return (
      <div>
        {filteredCountries.map(country => (
          <p key={country.name.common}>{country.name.common} 
          <button onClick={() => setCurrentCountry(country)}>show</button>
          </p>
        ))}
      </div>
    )
  }

  const countryDetail = ( country ) => {
    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>Capital {country.capital}</p>
        <p>Area {country.area}</p>
        <h3>Languages</h3>
        {console.log(Object.values(country.languages))}
        <ul>
          {Object.values(country.languages).map(language => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <img src={country.flags.png} />
      </div>
    )
  }

  
  const displayCountries = () => {
    if (currentCountry) {
      return countryDetail(currentCountry)
    }
    if (filteredCountries.length > 10) {
      return tooMany()
    }
    if (filteredCountries.length > 1) {
      return countryList()
    }
    if (filteredCountries.length === 1) {
      return countryDetail(filteredCountries[0])
    }
    else{
      return <p>Not found</p>
    }
 
  }

  return (
    <div>
      <form>find countries <input value={search} onChange={handleChange} /></form>
      {displayCountries()}
    </div>
  )
}

export default App
