const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.blogs)
})

describe('when there are initially some blogs saved', () => {

  test('all blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, helper.blogs.length)
    console.log('resposnse.body.length', response.body.length)
  })


  test('blogs id is named id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
      assert.strictEqual(blog._id, undefined)
      assert.ok(blog.id)
      console.log('Blog id', blog.id)
    })
  })

})

describe('addition of a new blog', () => {

  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()

    const result = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
    
    token = result.body.token
  })
  
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'aa',
      author: 'author',
      url: 'http://haha.com',
      likes: 1
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.blogs.length + 1)

    const contents = blogsAtEnd.map(b => b.title)
    assert(contents.includes('aa'))
  })
  test('if no token fails with 401', async () => {
    const newBlog = {
      title: 'aa',
      author: 'author',
      url: 'http://haha.com',
      likes: 1
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('if likes is missing', async () => {
    const newBlog = {
      title: 'no likes :(',
      author: 'author',
      url: 'http://haha.com',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = blogsAtEnd.find(b => b.title === 'no likes :(')
    assert.strictEqual(addedBlog.likes, 0)
  })


  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'no title',
      url: 'http://haha.com',
      likes: 5
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.blogs.length)
  })


  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'No url',
      author: 'author',
      likes: 3
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.blogs.length)
  })

})

describe('deletion of a blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    const usertodelete = await user.save()

    const result = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
    
    token = result.body.token

    const blog = new Blog({
      title: 'blog',
      author: 'hsh',
      url: 'http://he.com',
      user: usertodelete._id 
    })
    await blog.save()
  })

  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`) 
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  })

})

describe('updating o f ablog', () => {

  test('succeeds with updating likes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
  })

})

describe('when there is initially one user at db', () => {

  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

describe('invalid user creation', () => {
    test('fails with status 400 if password is too short', async () => {
      const newUser = {
        username: 'helanen',
        password: '67', 
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert(result.body.error.includes('Username and password should be atleast 3 characters'))
    })

    test('fails with status 400 if username is too short', async () => {
      const newUser = {
        username: 'he',
        password: '123',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert(result.body.error.includes('Username and password should be atleast 3 characters'))
    })
  })

after(async () => {
  await mongoose.connection.close()
})
