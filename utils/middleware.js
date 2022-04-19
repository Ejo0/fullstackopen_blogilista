const jwt = require('jsonwebtoken')
const User = require("../models/user")

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    request.token = null
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      request.token = authorization.substring(7)
    }
    next()
}

const userExtractor = async (request, response, next) => {
    request.user = null
    if (request.token) {
        const decodedToken = jwt.verify(request.token, process.env.SECRET_KEY)
        if (decodedToken.id) {
            request.user = await User.findById(decodedToken.id)
        }
    }
    next()
}

const errorHandler = (error, request, response, next) => {
    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'invalid token'})
    }
    next(error)
}

module.exports = { tokenExtractor, userExtractor, errorHandler }
