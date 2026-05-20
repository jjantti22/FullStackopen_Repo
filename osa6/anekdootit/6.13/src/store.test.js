import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
  }
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from './store'

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('useAnecdoteActions', () => {

  it('backend returns anecdotes correctly', async () => {
    const mockAnecdotes = [
    { id: '2', content: 'testcontent2', votes: 2 },
    { id: '1', content: 'testcontent', votes: 1 }
    ]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual(mockAnecdotes)
  })
})

describe('useAnecdote filtering', () => {
  it('anecdotes are ranked in order', () => {
    const mockAnecdotes = [
      { id: '1', content: 'testcontent', votes: 1 },
      { id: '2', content: 'testcontent2', votes: 2 }
    ]
    
    useAnecdoteStore.setState({ anecdotes: mockAnecdotes })

    const { result } = renderHook(() => useAnecdotes())

    expect(result.current).toHaveLength(2)
    expect(result.current[0].id).toBe('2')
    expect(result.current[1].id).toBe('1')
  })
})