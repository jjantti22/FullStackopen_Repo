import { create } from 'zustand'

const useCounterStore = create(set => ({
  good: 0,
  neutral: 0,
  bad: 0,
  actions: {
    incrementGood: () => set(state => ({ good: state.good + 1 })),
    incrementNeutral: () => set(state => ({ neutral: state.neutral + 1 })),
    incrementBad: () => set(state => ({ bad: state.bad + 1 })),
    zero: () => set(() => ({ good: 0, neutral: 0, bad: 0 })),
  }
}))

export const useCounter = () => {
  const good = useCounterStore(state => state.good)
  const neutral = useCounterStore(state => state.neutral)
  const bad = useCounterStore(state => state.bad)
  
  return { good, neutral, bad }
}

export const useCounterControls = () => useCounterStore(state => state.actions)