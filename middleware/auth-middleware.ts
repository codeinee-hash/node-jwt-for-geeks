import { NextFunction, Request, Response } from 'express'
import ApiError from '../exceptions/api-error'
import tokenService from '../services/token-service'

const authMiddleware = (
	req: Request,
	_res: Response,
	next: NextFunction,
): void => {
	try {
		const authHeader = req.headers.authorization
		if (!authHeader) {
			return next(ApiError.UnauthorizedError())
		}

		const [scheme, accessToken] = authHeader.split(' ')
		if (scheme !== 'Bearer' || !accessToken) {
			return next(ApiError.UnauthorizedError())
		}

		const userData = tokenService.validateAccessToken(accessToken)
		if (!userData) {
			return next(ApiError.UnauthorizedError())
		}

		req.user = userData
		return next()
	} catch (error) {
		return next(ApiError.UnauthorizedError())
	}
}

export default authMiddleware
