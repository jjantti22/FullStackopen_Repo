import { useState, useEffect } from 'react'
import anecdoteService from '../services/anecdotes'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }
  const clear = () => {
    setValue('')
  }
  return {
    contents: {
      type,
      value,
      onChange
    },
    clear
  }
}

// modules can have several named exports

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then(data => {
      setAnecdotes(data)
    })
  }, [])

  const addAnecdote = async (anecdoteObject) => {
    const newAnecdote = await anecdoteService.createNew(anecdoteObject)
    setAnecdotes(anecdotes.concat(newAnecdote))
  }
  const deleteAnecdote = async (id) => {
    await anecdoteService.remove(id)
    setAnecdotes(anecdotes.filter(a => a.id !== id))
  }
  return {
    anecdotes, addAnecdote, deleteAnecdote
  }
}