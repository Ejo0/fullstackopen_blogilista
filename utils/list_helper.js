const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favouriteBlog = (blogs => {
    if (blogs.length === 0) {
        return NaN
    }
    const result = blogs.reduce((f, b) => f.likes > b.likes ? f : b)
    return {
        title: result.title,
        author: result.author,
        likes: result.likes
    }
})

const mostBlogs = (blogs => {
    if (blogs.length === 0) {
        return NaN
    }
    const authors = findAuthors(blogs)

    const authorWithMostBlogs = {
        author: '',
        blogs: 0
    }

    Object.keys(authors).forEach(key => {
        if (authors[key].blogs > authorWithMostBlogs.blogs) {
            authorWithMostBlogs.author = key,
            authorWithMostBlogs.blogs = authors[key].blogs
        }
    })
    return authorWithMostBlogs
})

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return NaN
    }
    const authors = findAuthors(blogs)

    authorWithMostLikes = {
        author: '',
        likes: 0
    }

    Object.keys(authors).forEach(key => {
        if (authors[key].likes > authorWithMostLikes.likes) {
            authorWithMostLikes.author = key,
            authorWithMostLikes.likes = authors[key].likes
        }
    })
    return authorWithMostLikes
}

const findAuthors = (blogs) => {
    const output = {}
    blogs.forEach(blog => {
        if (!(output[blog.author])) {
            output[blog.author] = {
                blogs: 0,
                likes: 0
            }
        }
        output[blog.author].blogs += 1
        output[blog.author].likes += blog.likes
    })
    return output
}

module.exports = { dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes }
