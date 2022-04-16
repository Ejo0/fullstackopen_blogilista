const errorHandler = (error, request, response, next) => {
    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
}

module.exports = { errorHandler }
