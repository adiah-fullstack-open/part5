const { test, expect, beforeEach, describe } = require("@playwright/test");
const { createBlog, loginWith, viewBlogDetails } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    // clear db
    await request.post("/api/testing/reset");
    // create user
    await request.post("/api/users", {
      data: {
        name: "Nathaniel Adiah",
        username: "nathman",
        password: "pspProB9",
      },
    });

    await request.post("/api/users", {
      data: {
        name: "Second User",
        username: "seconduser",
        password: "pspProB9",
      },
    });

    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByTestId("username")).toBeVisible();
    await expect(page.getByTestId("password")).toBeVisible();

    await expect(page.getByText("logged in")).not.toBeVisible();
    await expect(page.getByText("Create new")).not.toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "nathman", "pspProB9");
      await expect(page.getByText("Nathaniel Adiah logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "nathman", "wrong");

      const errorDiv = await page.locator(".message-error");
      await expect(errorDiv).toContainText("Wrong credentials");

      await expect(page.getByText("logged in")).not.toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "nathman", "pspProB9");
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(
        page,
        "New Blog Playwright",
        "Brandon Sanderson",
        "http://google.com"
      );
      // await expect(
      //   page.getByText("New Blog Playwright Brandon Sanderson", { exact: true })
      // ).toBeVisible();
      const locator = page.getByTestId("New Blog Playwright");
      await expect(locator).toBeVisible();
    });

    describe("and blogs exist", () => {
      beforeEach(async ({ page }) => {
        await createBlog(
          page,
          "First Blog",
          "First Author",
          "https://fist-blog.com"
        );
        await createBlog(
          page,
          "Second Blog",
          "Second Author",
          "https://second-blog.com"
        );

        await createBlog(
          page,
          "Third Blog",
          "Second Author",
          "https://thirdBlog.com"
        );
      });

      test("one of them can increase likes", async ({ page }) => {
        // await viewBlogDetails(page, "Second Blog");

        const blogWrapper = page.getByTestId("Second Blog");
        await blogWrapper.getByRole("button", { name: "view" }).click();
        await page.pause();

        const likeButton = page.getByRole("button", { name: "like" });
        // await page.getByRole("button", { name: "like" }).click();

        // await likeButton.click();
        await likeButton.click();
        await expect(page.getByText("likes: 1")).toBeVisible();

        await likeButton.click();
        await expect(page.getByText("likes: 2")).toBeVisible();
      });

      test.skip("a blog can't be deleted if made by a different user", async ({
        page,
      }) => {
        // logout from the first user
        await page.getByRole("button", { name: "Logout" }).click();

        // login with second user
        await loginWith(page, "seconduser", "pspProB9");

        const blogWrapper = page.getByTestId("Second Blog");
        await blogWrapper.getByRole("button", { name: "view" }).click();
        await page.pause();
        const deleteButton = page.getByRole("button", { name: "remove" });
        await expect(deleteButton).not.toBeVisible();
      });

      test("one of them can be deleted", async ({ page }) => {
        const blogWrapper = page.getByTestId("Second Blog");
        await blogWrapper.getByRole("button", { name: "view" }).click();

        const deleteButton = page.getByRole("button", { name: "remove" });
        page.on("dialog", (dialog) => dialog.accept());
        await deleteButton.click();

        await expect(page.getByTestId("Second Blog")).not.toBeVisible();
      });

      test.only("blogs are ordered by likes", async ({ page }) => {
        const blogWrapper = page.getByTestId("Second Blog");
        await blogWrapper.getByRole("button", { name: "view" }).click();
        await page.pause();

        const likeButton = page.getByRole("button", { name: "like" });
        // await page.getByRole("button", { name: "like" }).click();

        // await likeButton.click();
        await likeButton.click();
        await expect(page.getByText("likes: 1")).toBeVisible();

        await likeButton.click();
        await expect(page.getByText("likes: 2")).toBeVisible();

        await page.reload();

        const blogs = page.locator(".blog").all();
        await expect(blogs).toBeVisible();

        // await expect(blogs[0]).toContainText("Second Blog");
      });
    });
  });
});
