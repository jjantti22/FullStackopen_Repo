import { useState } from 'react'
import { Button, Card, CardContent } from '@mui/material'
const Blog = ({ blog, addLikes, user , removeBlog }) => {
  const [visible, setVisible] = useState(false)

  if (!blog) {
    return null
  }

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <Card variant="outlined" style={{ marginBottom: 5 }}>
      <CardContent>
        <div className='blog'>
          <div>
            <h1>{blog.title}
              <Button onClick={toggleVisibility} variant="contained" style={hideWhenVisible}>view</Button>
              <Button onClick={toggleVisibility} variant="contained" style={showWhenVisible}>hide</Button>
            </h1>
             by {blog.author}
          </div>

          <div style={showWhenVisible}>
            <div>{blog.url}</div>
            <div>
              likes {blog.likes}
              {user && <Button size="small" variant="contained" onClick={addLikes}>like</Button>}
            </div>
            <div>{blog.user.name}</div>
            {user && blog.user.username === user.username && (
              <Button color="error" onClick={removeBlog}>remove</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Blog