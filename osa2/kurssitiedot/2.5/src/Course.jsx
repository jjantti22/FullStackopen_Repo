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

  const total = props.parts.reduce((sum, exercise) => {
    return sum + exercise.exercises
  }, 0) 

  return (
    <div>
      <p> <b>Total of {total} exercises </b> </p>
    </div>
  )
}

export default Course