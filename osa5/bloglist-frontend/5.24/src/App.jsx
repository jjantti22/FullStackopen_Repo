import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import {
  Routes, Route, Link, useNavigate
} from 'react-router-dom'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const blogFormRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setSuccessMessage(`ölogged in as ${user.name}`)
      navigate('/')
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch {
      setErrorMessage('wrong username or password')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService.create(blogObject).then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      setSuccessMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => setSuccessMessage(null), 5000)
    })
      .catch(() => {
        setErrorMessage('failed to create blog')
        setTimeout(() => setErrorMessage(null), 5000)
      })
  }

  const removeBlog = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      blogService
        .remove(blog.id)
        .then(() => {
          setBlogs(blogs.filter(b => b.id !== blog.id))
          setSuccessMessage('Removed blog succesfully')
          setTimeout(() => setSuccessMessage(null), 5000)
        })
        .catch(() => {
          setErrorMessage('failed to remove blog')
          setTimeout(() => setErrorMessage(null), 5000)
        })
    }
  }

  const addLike = (blog) => {
    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    blogService
      .update(blog.id, updatedBlog)
      .then(returnedBlog => {
        const originalBlog = { ...returnedBlog, user: blog.user }
        setBlogs(blogs.map(b => b.id !== blog.id ? b : originalBlog))
      })
      .catch(() => {
        setErrorMessage('failed to update likes')
        setTimeout(() => setErrorMessage(null), 5000)
      })
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setSuccessMessage('logged out')
    navigate('/')
    setTimeout(() => setSuccessMessage(null), 5000)
  }

  const loginForm = () => (
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleSubmit={handleLogin}
    />
  )

  const padding = {
    padding: 5
  }

  return (
    <div>
      <div>
        <Link style={padding} to="/">blogs</Link>
        {!user && <Link style={padding} to="/login">login</Link>}
        {user && <button onClick={handleLogout}>logout</button>}
      </div>

      <h1>Blogs</h1>
      <Notification message={successMessage} typeOfMessage="success" />
      <Notification message={errorMessage} typeOfMessage="error" />

      <Routes>
        <Route path="/login" element={loginForm()} />
        <Route path="/" element={
          <div>
            {user && (
              <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                <BlogForm createBlog={addBlog} />
              </Togglable>
            )}
            {blogs
              .sort((firstBlog, secondBlog) => secondBlog.likes - firstBlog.likes)
              .map(blog =>
                <Blog key={blog.id} blog={blog} user={user} addLikes={() => addLike(blog)} removeBlog={() => removeBlog(blog)} />
              )}
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App