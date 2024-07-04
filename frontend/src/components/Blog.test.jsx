// Check that a blog shows the title and author, but not the url or number of likes
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

const blog = {
  title: "Test with vitest",
  author: "Nathaniel Adiah",
  url: "nathanielsblogs.github.io",
  likes: 7,
  user: {
    username: "nathman",
    name: "Nathaniel Adiah",
    id: "668036cbe2a2230260526419",
  },
  id: "668065b2d89437cc923f587b",
};

const userObj = {
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5hdGhtYW4iLCJpZCI6IjY2ODAzNmNiZTJhMjIzMDI2MDUyNjQxOSIsImlhdCI6MTcxOTk5NDQ4OH0.OXx4RFGVLg23qBJL7wCrTEt-wgsHFILQQWKClU5OTFc",
  username: "nathman",
  name: "Nathaniel Adiah",
};

describe("<Blog />", () => {
  let container;
  const handleDelete = vi.fn();

  beforeEach(() => {
    container = render(
      <Blog blog={blog} user={userObj} deleteBlog={handleDelete} />
    ).container;
  });

  test("renders only blog title and author by default", () => {
    expect(screen.getByText(blog.title, { exact: false }));
    expect(screen.getByText(blog.author, { exact: false }));

    // const element = screen.queryByText("do not want this thing to be rendered");
    // expect(element).toBeNull();

    expect(container.querySelector(".blog-url")).not.toBeInTheDocument();
    expect(container.querySelector(".blog-likes")).not.toBeInTheDocument();
  });

  test("shows url and number of likes when button is clicked", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("view");
    await user.click(button);

    expect(container.querySelector(".blog-likes")).toBeInTheDocument();
    expect(screen.getByText(blog.title, { exact: false }));
    expect(screen.getByText(blog.author, { exact: false }));
    expect(screen.getByText(blog.url, { exact: false }));
    // screen.debug();
  });

  // test.only("shows correct number of calls to like function", async () => {
  //   const user = userEvent.setup();
  //   const detailsButton = screen.getByText("view");
  //   await user.click(detailsButton);

  //   const likeButton = container.querySelector(".addLike");
  //   screen.debug(likeButton);
  // });
});
