const blogsRouter = require('express').Router()
const Blog = require("../models/blog")
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const userFoo = await User.findById('625d7d772cec3b828e6e6f30')

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: userFoo._id
  })

  const savedBlog = await blog.save()

  userFoo.blogs = userFoo.blogs.concat(savedBlog._id)
  await userFoo.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id/like', async (request, response) => {
  const { likes } = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,
    { likes },
    { new: true, runValidators: true, context: 'query' })
  
  response.json(updatedBlog)
})

module.exports = blogsRouter