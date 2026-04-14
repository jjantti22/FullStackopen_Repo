import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)


  const inputs = screen.getAllByRole('textbox')
  const sendButton = screen.getByText('create')


  await user.type(inputs[0], 'testing a title...')
  await user.type(inputs[1], 'testing a author...')
  await user.type(inputs[2], 'testing a url...')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing a title...')
  expect(createBlog.mock.calls[0][0].author).toBe('testing a author...')
  expect(createBlog.mock.calls[0][0].url).toBe('testing a url...')
})