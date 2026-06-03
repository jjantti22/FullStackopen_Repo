import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useField, useAnecdotes } from '../hooks'

const CreateNew = () => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  const navigate = useNavigate()
  const { addAnecdote } = useAnecdotes()

  const handleSubmit = (e) => {
    e.preventDefault()
    addAnecdote({ content: content.contents.value, author: author.contents.value, info: info.contents.value, votes: 0 })
    navigate('/')
  }

  const handleClear = (e) => {
    e.preventDefault()
    content.clear()
    author.clear()
    info.clear()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content.contents} />
        </div>
        <div>
          author
          <input {...author.contents} />
        </div>
        <div>
          url for more info
          <input {...info.contents} />
        </div>
        <button>create</button>
        <button onClick={handleClear}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew
