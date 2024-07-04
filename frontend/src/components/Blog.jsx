import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, user, deleteBlog }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLikeButton = async () => {
    const newData = {
      ...blog,
      user: blog.user.id,
      likes: likes + 1,
    };

    delete newData.id;

    const updatedBlog = await blogService.addLike(newData, blog.id);
    setLikes(updatedBlog.likes);
  };

  const toggleDetails = () => {
    setShowDetails((prevState) => !prevState);
  };

  return (
    <div style={blogStyle} className="blog">
      {!showDetails && (
        <div data-testid={blog.title}>
          <span className="blog-title">{blog.title}</span>
          <span className="blog-author"> {blog.author}</span>
          <button className="showDetails" onClick={toggleDetails}>
            view
          </button>
        </div>
      )}
      {/* <button onClick={toggleDetails}>{showDetails ? "hide" : "view"}</button> */}
      {showDetails && (
        <div>
          <span className="blog-title">{blog.title}</span>{" "}
          <button className="hideDetails" onClick={toggleDetails}>
            hide
          </button>
          <br />
          <p className="blog-url">{blog.url}</p>
          <span className="blog-likes">likes: {likes}</span>
          <button className="addLike" onClick={handleLikeButton}>
            like
          </button>
          <br />
          <p className="blog-author">{blog.author}</p>
          <br />
          {user.username === blog.user.username && (
            <button className="deleteBlog" onClick={() => deleteBlog(blog.id)}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};
export default Blog;
