import { useAnecdotes, useAnecdoteActions, useNotificationActions } from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote, remove } = useAnecdoteActions()
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
            {anecdote.votes === 0 && (<button onClick={async () => (await remove(anecdote.id), showNotification(`You deleted '${anecdote.content}'`))}>delete</button>)}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList