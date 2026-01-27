const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.blogs)
})

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

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'aa',
    author: 'author',
    url: 'http://haha.com',
    likes: 1
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.blogs.length + 1)

  const contents = blogsAtEnd.map(b => b.title)
  assert(contents.includes('aa'))
})

test('if likes is missing', async () => {
  const newBlog = {
    title: 'no likes :(',
    author: 'author',
    url: 'http://haha.com',
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const addedBlog = blogsAtEnd.find(b => b.title === 'no likes :(')
  assert.strictEqual(addedBlog.likes, 0)
})

after(async () => {
  await mongoose.connection.close()
})
