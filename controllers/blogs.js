const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require("../models/blog")
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', {
      username: 1,
      name: 1
    })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user
  if (!user) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  await savedBlog.populate('user', {
    username: 1,
    name: 1
  })

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }
  const blog = await Blog.findById(request.params.id)
  if (user.id !== blog.user.toString()) {
    return response.status(401).json({
      error: 'no rights to remove blog'
    })
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id/like', async (request, response) => {
  const {
    likes
  } = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, {
      likes
    }, {
      new: true,
      runValidators: true,
      context: 'query'
    })
    .populate('user', {
      username: 1,
      name: 1
    })

  response.json(updatedBlog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const comment = request.body.comment
  const commentedBlog = await Blog.findByIdAndUpdate(request.params.id, {
      $push: {
        comments: comment
      }
    }, {
      new: true,
      runValidators: true,
      context: 'query'
    })
    .populate('user', {
      username: 1,
      name: 1
    })

  response.json(commentedBlog)
})

module.exports = blogsRouter
