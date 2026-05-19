import { useAnecdotes, useAnecdoteActions, useNotificationActions } from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote } = useAnecdoteActions()
  const { showNotification } = useNotificationActions()
  const rankedAnecdotes = anecdotes.toSorted((a, b) => b.votes - a.votes)
  return (
    <div>
      {rankedAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={async () => (await vote(anecdote.id), showNotification(`You voted '${anecdote.content}'`))}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList