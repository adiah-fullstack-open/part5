import { useEffect, useRef, useState } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

import "./App.css";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState(null);
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const [user, setUser] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const userJSON = window.localStorage.getItem("blogAppUser");
    if (userJSON) {
      const user = JSON.parse(userJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const addNotification = (type, text) => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const handleChange = (e) => {
    setLoginForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddBlog = async (blogData) => {
    try {
      const returnedBlog = await blogService.create(blogData);
      blogFormRef.current.toggleVisibility();
      addNotification(
        "success",
        `New blog ${returnedBlog.title} by ${returnedBlog.author} added`
      );
      setBlogs((prevBlogs) => [...prevBlogs, returnedBlog]);
    } catch (exception) {
      addNotification("error", "Problem adding blog");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await loginService.login(loginForm);

      window.localStorage.setItem("blogAppUser", JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setLoginForm({ username: "", password: "" });
      addNotification("success", `${user.username} logged in`);
    } catch (exception) {
      addNotification("error", "Wrong credentials");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("blogAppUser");
    addNotification("success", "User logged out");
    blogService.setToken(null);
    setUser(null);
  };

  const handleDelete = async (blogId) => {
    if (window.confirm("Do you really want to delete?")) {
      await blogService.deleteBlog(blogId);

      setBlogs((prevState) => prevState.filter((blog) => blog.id !== blogId));
      addNotification("success", "Blog deleted");
    }
  };

  if (user === null) {
    return (
      <form onSubmit={handleLogin}>
        {message && <Notification message={message} />}
        <div>
          username
          <input
            type="text"
            value={loginForm.username}
            name="username"
            id="username"
            onChange={handleChange}
            data-testid="username"
          />
        </div>
        <div>
          password
          <input
            data-testid="password"
            type="password"
            name="password"
            id="password"
            value={loginForm.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">login</button>
      </form>
    );
  }

  return (
    <div>
      {message && <Notification message={message} />}
      <h2>blogs</h2>

      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>Logout</button>

      <h2>Create new</h2>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm addBlog={handleAddBlog} />
      </Togglable>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            deleteBlog={handleDelete}
          />
        ))}
    </div>
  );
};

export default App;
