const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}

const Course = (props) => {  
  console.log(props)  
  const { course } = props
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
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
      {props.parts.map(value => 
        <p key = {value.id}>
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
      <p> <b>Total of {exercises} exercises </b> </p>
    </div>
  )
}



export default App