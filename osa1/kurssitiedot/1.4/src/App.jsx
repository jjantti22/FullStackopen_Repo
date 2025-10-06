const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      <Header course={course} />

      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}
const Header = (props) => {  
  return (
    
    <div>
      
      <h1>{props.course}</h1>    
    </div>
  )
}
const Content = (props) => { 

  return (
    <div>
      {props.parts.map((value, i) => 
        <p key = {i}>
          {value.name} {value.exercises}
        </p>
      )}
    </div>
  )
}


const Total = (props) => {  

  let exercises = 0;
  props.parts.forEach(value => {
    exercises += value.exercises
  });
  return (
    <div>
      <p>Number of exercises {exercises} </p>
    </div>
  )
}



export default App