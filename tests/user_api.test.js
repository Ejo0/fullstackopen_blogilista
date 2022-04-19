const bcrypt = require('bcrypt')
const { default: mongoose } = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({
            username: 'foo',
            name: 'foo bar',
            passwordHash
        })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await usersAtDb()

        expect(usersAtStart).toHaveLength(1)

        const newUser = {
            username: 'ada',
            name: 'ada lo',
            password: 'buu'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await usersAtDb()
        expect(usersAtEnd).toHaveLength(2)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails properly if username already taken', async () => {
        const newUser = {
            username: 'foo',
            name: 'foo foo',
            password: 'pass'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        expect(result.body.error).toContain('username must be unique')

        const usersAtEnd = await usersAtDb()
        expect(usersAtEnd).toHaveLength(1)
    })
})

const usersAtDb = async () => {
    const usersData = await User.find({})
    return usersData.map(u => u.toJSON())
}

afterAll(() => {
    mongoose.connection.close()
})
