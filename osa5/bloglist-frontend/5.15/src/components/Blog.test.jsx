import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders author and title', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'test author',
    url: 'https://test.com/',
    likes: 0,
    user: {
      name: 'test author',
      _id: '0'
    }
  }

  const user = {
    id: '0'
  }

  render(<Blog blog={blog} user={user}/>)

  const element = screen.getByText('Component testing is done with react-testing-library Test Author', { exact: false })

  expect(element).toBeDefined()
})

test('clicking the view button displays url and likes', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'test author',
    url: 'https://test.com/',
    likes: 0,
    user: {
      name: 'test user',
      _id: '0'
    }
  }

  const user = {
    id: '0'
  }

  render(
    <Blog blog={blog} user={user} />
  )

  const session = userEvent.setup()
  const button = screen.getByText('view')
  await session.click(button)

  const url = screen.getByText('https://test.com/', { exact: false })
  const likes = screen.getByText('likes 0', { exact: false })
  const userName = screen.getByText('test user', { exact: false })

  expect(url).toBeVisible()
  expect(likes).toBeVisible()
  expect(userName).toBeVisible()
})

test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'test author',
    url: 'https://test.com/',
    likes: 0,
    user: {
      name: 'test user',
      _id: '0'
    }
  }

  const user = {
    id: '0'
  }
  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} user={user} addLikes={mockHandler} />
  )

  const session = userEvent.setup()
  const viewButton = screen.getByText('view')
  await session.click(viewButton)

  const likeButton = screen.getByText('like')
  await session.click(likeButton)
  await session.click(likeButton)

  screen.debug()
  expect(mockHandler.mock.calls).toHaveLength(2)
})