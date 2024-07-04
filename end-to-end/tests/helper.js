const loginWith = async (page, username, password) => {
  await page.getByTestId("username").fill(username);
  await page.getByTestId("password").fill(password);

  await page.getByRole("button", { name: "login" }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole("button", { name: "create new blog" }).click();
  await page.getByTestId("title").fill(title);
  await page.getByTestId("author").fill(author);
  await page.getByTestId("url").fill(url);
  await page.getByRole("button", { name: "create" }).click();
  // await page.getByText(`${title} ${author}`, { exact: true }).waitFor();
  await page.getByTestId(title).waitFor();
};

const viewBlogDetails = async (page, blogTitle) => {
  // await page
  //   .getByTestId(blogTitle)
  //   .getByRole("button", { name: "view" })
  //   .click();
  const blogWrapper = page.getByTestId(blogTitle);
  await blogWrapper.getByRole("button", { name: "view" }).click();
};

export { createBlog, loginWith, viewBlogDetails };
