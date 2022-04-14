const listHelper = require('../utils/list_helper')

describe('dummy', () => {
    test('returns one', () => {
        expect(listHelper.dummy([])).toBe(1)
    })
})

const listWithmManyBlogs = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]

describe('total likes', () => {
    test('with empty list is zero', () => {
        expect(listHelper.totalLikes([])).toBe(0)
    })

    test('with several blogs returs correct sum', () => {
        expect(listHelper.totalLikes(listWithmManyBlogs)).toBe(16)
    })
})

describe('favourite list', () => {
    test('with several blogs returns one with most likes', () => {
        result = listHelper.favouriteBlog(listWithmManyBlogs).author
        expect(result).toEqual('Michael Chan')
    })

    test('with zero blogs returns NaN', () => {
        expect(listHelper.favouriteBlog([])).toBe(NaN)
    })
})

describe('most blogs', () => {
    test('with several blogs returs author with most blogs', () => {
        result = listHelper.mostBlogs(listWithmManyBlogs)
        expect(result).toEqual({
            author: 'Robert C. Martin',
            blogs: 2
        })
    })

    test('with zero blogs returns NaN', () => {
        expect(listHelper.mostBlogs([])).toBe(NaN)
    })
})

describe('most likes', () => {
    test('with several blogs returs author with most likes', () => {
        result = listHelper.mostLikes(listWithmManyBlogs)
        expect(result).toEqual({
            author: 'Michael Chan',
            likes: 7
        })
    })
})