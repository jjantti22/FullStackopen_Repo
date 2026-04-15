import { TextField, Button } from '@mui/material'
const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <div>
      <h2>log in to application</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            variant="standard"
            label="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <TextField
            variant="standard"
            label="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <Button type="submit" variant="contained" >login</Button>
      </form>
    </div>
  )
}

export default LoginForm