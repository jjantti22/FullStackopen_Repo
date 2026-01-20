const _ = require('lodash')
const dummy = (blogs) => {
  return 1
}

function totalLikes(blogs) {
  function reducer(sum, blog) {
    return sum + blog.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  let favorite = blogs[0]

  for (let i = 1; i < blogs.length; i++) {
    if (blogs[i].likes > favorite.likes) {
      favorite = blogs[i]
    }
  }

  return favorite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authors = _.groupBy(blogs, 'author')

  const authorCounts = _.map(authors, (authorBlogs, author) => {
    const blogCount = authorBlogs.length
    return {
      author: author,
      blogs: blogCount
    }
  })

  return _.maxBy(authorCounts, 'blogs')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}