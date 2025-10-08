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
      <Statistics goodClicks={good} neutralClicks={neutral} badClicks={bad}/>
    </div>
  )
}


const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)
const Statistics = (props) => {
  const {goodClicks, neutralClicks, badClicks} = props
  const totalClicks = goodClicks + neutralClicks + badClicks
  const average = (goodClicks - badClicks) / totalClicks
  const percent = goodClicks / totalClicks * 100
  return (
    <div>
      <p>
      good {goodClicks} <br></br>
      neutral {neutralClicks} <br></br>
      bad {badClicks}  <br></br>
      all {totalClicks} <br></br>
      average {average} <br></br>
      positive {percent} % <br></br>
      </p>
    </div>
  )
}

export default App
