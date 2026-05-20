import { useAnecdoteActions, useNotificationActions } from '../store'

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions()
  const { showNotification } = useNotificationActions()

  const addAnecdote = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    add(content)
    showNotification(`You added '${content}'`)
    e.target.reset()
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name='anecdote'/>
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm