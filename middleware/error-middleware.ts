import { ErrorRequestHandler } from 'express'
import ApiError from '../exceptions/api-error'

const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
	if (error instanceof ApiError) {
		return res.status(error.status).json({
			message: error.message,
			errors: error.errors,
		})
	}

	return res.status(500).json({ message: 'Unexpected error' })
}

export default errorMiddleware
