import { create } from 'zustand'

const useNotificationStore = create((set) => ({
  message: '',
  typeOfMessage: '',
  actions: {
    showNotification: (message, typeOfMessage = 'success') => {
      set({ message, typeOfMessage })
      setTimeout(() => set({ message: '' , typeOfMessage: ''}), 5000)
    }
  }
}))

export const useNotificationMessage = () => useNotificationStore((state) => state.message)
export const useNotificationType = () => useNotificationStore((state) => state.typeOfMessage)
export const useNotificationActions = () => useNotificationStore((state) => state.actions)