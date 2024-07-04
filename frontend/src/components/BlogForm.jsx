import { useState } from "react";

const BlogForm = ({ addBlog }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    url: "",
  });

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    addBlog(formData);

    setFormData({ title: "", author: "", url: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        title:
        <input
          data-testid="title"
          type="text"
          value={formData.title}
          name="title"
          id="title"
          placeholder="Title"
          onChange={handleChange}
        />
      </div>
      <div>
        author:
        <input
          data-testid="author"
          type="text"
          value={formData.author}
          name="author"
          id="author"
          placeholder="Author"
          onChange={handleChange}
        />
      </div>

      <div>
        url:
        <input
          data-testid="url"
          type="text"
          value={formData.url}
          name="url"
          id="url"
          placeholder="URL"
          onChange={handleChange}
        />
      </div>
      <button type="submit">create</button>
    </form>
  );
};
export default BlogForm;
