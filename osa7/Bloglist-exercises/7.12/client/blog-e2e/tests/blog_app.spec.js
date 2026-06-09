/* eslint-disable no-undef */
const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog, likeBlog, deleteBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });
    await request.post("/api/users", {
      data: {
        name: "Joku",
        username: "Joku",
        password: "646464",
      },
    });
    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    await page.getByRole("link", { name: "login" }).click();

    await expect(page.getByText("log in to application")).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "mluukkai", "salainen");
      await expect(page.getByText("logged in as")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "mluukkai", "wrong");
      const errorDiv = page.locator(".error");
      await expect(errorDiv).toContainText("wrong username or password");
      await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");

      await expect(page.getByText("logged in as")).not.toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "mluukkai", "salainen");
      await createBlog(
        page,
        "test title",
        "jokunen jossain",
        "http://testi.com",
      );
    });

    test("a new blog can be created", async ({ page }) => {
      await expect(
        page.getByText("a new blog test title by jokunen jossain added"),
      ).toBeVisible();
    });
    test("a blog liked succesfully", async ({ page }) => {
      await likeBlog(page, "test title", "jokunen jossain");
      const blog = page.getByText("test title jokunen jossain").locator("..");
      await expect(blog.getByText("likes 1")).toBeVisible();
    });
    test("a blog can be removed", async ({ page }) => {
      await deleteBlog(page, "test title", "jokunen jossain");
      await expect(
        page.getByText("test title jokunen jossain"),
      ).not.toBeVisible();
    });
    test("only the creator can see the delete button", async ({ page }) => {
      await page.getByRole("button", { name: "logout" }).click();
      await loginWith(page, "Joku", "646464");
      await page.getByText("test title jokunen jossain").click();
      await page.getByRole("button", { name: "view" }).click();
      await expect(
        page.getByRole("button", { name: "remove" }),
      ).not.toBeVisible();
    });
    describe("testing with many blogs", () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, "second blog", "2", "http://2.com");
      });

      test("blogs are arranged in the order of most likes first", async ({
        page,
      }) => {
        const blogToLike = page.getByText("second blog 2").locator("..");
        await blogToLike.getByRole("button", { name: "view" }).click();
        await blogToLike.getByRole("button", { name: "like" }).click();
        await expect(blogToLike.getByText("likes 1")).toBeVisible();

        const blogLocators = page.locator(".blog");

        await expect(blogLocators.first()).toContainText("second blog");
        await expect(blogLocators.last()).toContainText("test title");
      });
    });
  });
});
