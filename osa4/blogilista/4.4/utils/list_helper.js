const dummy = (blogs) => {
  return 1
}

function totalLikes(blogs) {
  function reducer(sum, blog) {
    return sum + blog.likes
  }

  return blogs.reduce(reducer, 0)
}

module.exports = {
  dummy,
  totalLikes
}