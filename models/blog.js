const mongoose = require('mongoose')

const blogSchema = {
    title: String,
    author: String,
    url: String,
    likes: Number
}

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
