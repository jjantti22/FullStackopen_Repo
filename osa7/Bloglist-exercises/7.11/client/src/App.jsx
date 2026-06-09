import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import BlogList from "./components/BlogList";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import ErrorBoundary from "./components/ErrorBoundary";
import { useNotificationActions } from "./store";
import { Routes, Route, Link, useNavigate, useMatch } from "react-router-dom";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const { showNotification } = useNotificationActions();
  const navigate = useNavigate();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      showNotification(`logged in as ${user.name}`, "success");
      navigate("/");
    } catch {
      showNotification("wrong username or password", "error");
    }
  };

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog));
        showNotification(
          `a new blog ${blogObject.title} by ${blogObject.author} added`, "success"
        );
        navigate("/");
      })
      .catch(() => {
        showNotification("failed to create blog", "error");
      });
  };

  const removeBlog = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      blogService
        .remove(blog.id)
        .then(() => {
          setBlogs(blogs.filter((b) => b.id !== blog.id));
          showNotification("Removed blog succesfully", "success");
          navigate("/");
        })
        .catch(() => {
          showNotification("failed to remove blog", "error");
        });
    }
  };

  const addLike = (blog) => {
    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    };
    blogService
      .update(blog.id, updatedBlog)
      .then((returnedBlog) => {
        const originalBlog = { ...returnedBlog, user: blog.user };
        setBlogs(blogs.map((b) => (b.id !== blog.id ? b : originalBlog)));
      })
      .catch(() => {
        showNotification("failed to update likes", "error");
      });
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
    showNotification("logged out", "success");
    navigate("/");
  };

  const loginForm = () => (
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleSubmit={handleLogin}
    />
  );

  const padding = {
    padding: 5,
  };

  const match = useMatch("/blogs/:id");
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  return (
    <div>
      <div>
        <Link style={padding} to="/">
          blogs
        </Link>
        {!user && (
          <Link style={padding} to="/login">
            login
          </Link>
        )}
        {user && (
          <Link style={padding} to="/create">
            new blog
          </Link>
        )}
        {user && <button onClick={handleLogout}>logout</button>}
      </div>
      
      <Notification />

      <ErrorBoundary>
        <Routes>
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blog={blog}
                user={user}
                addLikes={() => addLike(blog)}
                removeBlog={() => removeBlog(blog)}
              />
            }
          />
          <Route path="/login" element={loginForm()} />
          <Route path="/create" element={<BlogForm createBlog={addBlog} />} />
          <Route path="/" element={<BlogList blogs={blogs} user={user} />} />
          <Route path="*" element={<h1>404 - Page not found</h1>} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
};

export default App;
