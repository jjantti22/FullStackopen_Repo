import { Alert } from '@mui/material'
const Notification = ({ message, typeOfMessage }) => {
  if (message === null) {
    return null
  }

  return (
    <Alert className={typeOfMessage} severity={typeOfMessage}>
      {message}
    </Alert>
  )
}

export default Notification