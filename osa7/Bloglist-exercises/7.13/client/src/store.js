import { create } from 'zustand'
import blogService from './services/blogs'

const useBlogStore = create((set, get) => ({
  blogs: [],
  actions: {
    like: async (id) => {
      const blog = get().blogs.find(b => b.id === id)
      const updated = await blogService.update(id, { ...blog, likes: blog.likes + 1 })

      set((state) => ({
        blogs: state.blogs.map(b => b.id === id ? updated : b)
      }))
    },
    add: async (blogObject) => {
      const newBlog = await blogService.create(blogObject)
      set((state) => ({
        blogs: [...state.blogs, newBlog]
      }))
    },
    remove: async (id) => {
      await blogService.remove(id)
      set((state) => ({
        blogs: state.blogs.filter(b => b.id !== id)
      }))
    },
    initialize: async () => {
      const blogs = await blogService.getAll()
      set(() => ({ blogs }))
    }
  },
}))

export const useBlogs = () => useBlogStore((state) => state.blogs)
export const useBlogActions = () => useBlogStore((state) => state.actions)

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
