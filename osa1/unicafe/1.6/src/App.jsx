import { useState } from 'react'

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
  }
  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }
  const handleBadClick = () => {
    setBad(bad + 1)
  }


  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleGoodClick} text='good' />
      <Button onClick={handleNeutralClick} text='neutral' />
      <Button onClick={handleBadClick} text='bad' />
      <h1>statistics</h1>
      <Statistics text='good' clicks={good} />
      <Statistics text='neutral' clicks={neutral} />
      <Statistics text='bad' clicks={bad} />
    </div>
  )
}


const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)
const Statistics = (props) => {
  const {text, clicks} = props
  return (
    <div>
      <p>
      {text} {clicks} 
      </p>
    </div>
  )
}

export default App
