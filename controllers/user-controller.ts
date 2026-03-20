import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ApiError from '../exceptions/api-error'
import userService from '../services/user-service'

interface AuthBody {
	email: string
	password: string
}

type RequestWithAuthBody = Request<Record<string, never>, unknown, AuthBody>
type RequestWithCookies = Request & {
	cookies: {
		refreshToken?: string
	}
}

class UserController {
	registration = async (
		req: RequestWithAuthBody,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest('Validation error', errors.array()))
			}

			const { email, password } = req.body
			const userData = await userService.registration(email, password)

			res.cookie('refreshToken', userData.refreshToken, {
				httpOnly: true,
				maxAge: 30 * 24 * 60 * 60 * 1000,
			})

			return res.json(userData)
		} catch (error) {
			return next(error)
		}
	}

	login = async (
		req: RequestWithAuthBody,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest('Validation error', errors.array()))
			}

			const { email, password } = req.body
			const userData = await userService.login(email, password)

			res.cookie('refreshToken', userData.refreshToken, {
				httpOnly: true,
				maxAge: 30 * 24 * 60 * 60 * 1000,
			})

			return res.json(userData)
		} catch (error) {
			return next(error)
		}
	}

	logout = async (
		req: RequestWithCookies,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		try {
			const { refreshToken } = req.cookies
			const token = await userService.logout(refreshToken)
			res.clearCookie('refreshToken')

			return res.json(token)
		} catch (error) {
			return next(error)
		}
	}

	refresh = async (
		req: RequestWithCookies,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		try {
			const { refreshToken } = req.cookies
			const userData = await userService.refresh(refreshToken)

			res.cookie('refreshToken', userData.refreshToken, {
				httpOnly: true,
				maxAge: 30 * 24 * 60 * 60 * 1000,
			})

			return res.json(userData)
		} catch (error) {
			return next(error)
		}
	}

	getUsers = async (
		_req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		try {
			const users = await userService.getAllUsers()
			return res.json(users)
		} catch (error) {
			return next(error)
		}
	}
}

export default new UserController()
