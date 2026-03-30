import { render, screen } from '@testing-library/react'
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

  screen.debug(element)

  expect(element).toBeDefined()
})