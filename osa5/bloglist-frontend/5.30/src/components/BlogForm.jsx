import { useState } from 'react'
import { TextField, Button } from '@mui/material'
const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <TextField
            size="small"
            label="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <TextField
            size="small"
            label="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <TextField
            size="small"
            label="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <Button variant="contained" type="submit">create</Button>
      </form>
    </div>
  )
}

export default BlogForm