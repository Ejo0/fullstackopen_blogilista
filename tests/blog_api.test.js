const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [{
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
})

describe('get all:', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(2)
    })

    test('identifying key is "id"', async () => {
        const response = await api.get('/api/blogs')
        const blog = response.body[0]

        expect(blog.id).toBe('5a422aa71b54a676234d17f8')
    })

    test('a spesific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')
        const titles = response.body.map(blog => blog.title)

        expect(titles).toContain('React patterns')
    })
})

describe('post:', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'async/await simplifies making async calls',
            author: 'Foo Bar',
            url: 'foo.bar',
            likes: 3
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        const titles = response.body.map(blog => blog.title)

        expect(response.body).toHaveLength(3)
        expect(titles).toContain('async/await simplifies making async calls')
    })

    test('default value of "likes" is zero', async () => {
        const newBlog = {
            title: 'a blog without likes',
            author: 'John Doe',
            url: 'nn.n'
        }

        const createdBlog = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)

        expect(createdBlog.body.likes).toBe(0)
    })

    test('post without title and url returns 400', async () => {
        const newBlog = {
            title: 'a blog without author and url'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })
})


describe('delete', () => {
    test('removes a blog with correct id', async () => {
        await api
            .delete('/api/blogs/5a422aa71b54a676234d17f8')

        const response = await api.get('/api/blogs')
        const ids = response.body.map(blog => blog.id)

        expect(ids).toHaveLength(1)
        expect(ids[0]).toBe('5a422a851b54a676234d17f7')
    })

    test('with unvalid id returns correct error', async () => {
        const response = await api
            .delete('/api/blogs/nnn')

        expect(response.status).toBe(400)
        expect(response.body.error).toBe('malformatted id')
    })
})

describe('update', () => {
    test('likes can be updated', async () => {
        let updatedBlog = await api
            .put('/api/blogs/5a422aa71b54a676234d17f8/like')
            .send({
                likes: 6
            })



        expect(updatedBlog.body.likes).toBe(6)

        const blogsAfterUpdate = await api
            .get('/api/blogs')

        expect(blogsAfterUpdate.body[0].likes).toBe(6)
        expect(blogsAfterUpdate.body[0].title).toBe('Go To Statement Considered Harmful')
    })
})

afterAll(() => {
    mongoose.connection.close()
})