const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'log in' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}
const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByLabel('title:').fill(title)
  await page.getByLabel('author:').fill(author)
  await page.getByLabel('url:').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}
const likeBlog = async (page, title, author) => {
  const blog = page.getByText(`${title} ${author}`).locator('..')
  await blog.getByRole('button', { name: 'view' }).click()
  await blog.getByRole('button', { name: 'like' }).click()
}
export { loginWith, createBlog, likeBlog }