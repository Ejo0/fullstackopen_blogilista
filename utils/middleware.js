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

module.exports = { errorHandler }
