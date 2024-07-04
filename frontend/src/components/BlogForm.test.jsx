import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

describe("<BlogForm />", () => {
  // let container;
  // const handleDelete = vi.fn();

  // beforeEach(() => {
  //   container = render(
  //     <Blog blog={blog} user={userObj} deleteBlog={handleDelete} />
  //   ).container;
  // });

  test("calls event handler with right details", async () => {
    const addBlog = vi.fn();
    const user = userEvent.setup();

    render(<BlogForm addBlog={addBlog} />);
    const titleInput = screen.getByPlaceholderText("Title");
    const authorInput = screen.getByPlaceholderText("Author");
    const urlInput = screen.getByPlaceholderText("URL");

    const submitButton = screen.getByText("create");

    await user.type(titleInput, "Testing a Form");
    await user.type(authorInput, "Nathaniel Adiah");
    await user.type(urlInput, "https://google.com");

    await user.click(submitButton);

    expect(addBlog.mock.calls).toHaveLength(1);
    expect(addBlog.mock.calls[0][0]).toMatchObject({
      title: "Testing a Form",
      author: "Nathaniel Adiah",
      url: "https://google.com",
    });
  });
});
