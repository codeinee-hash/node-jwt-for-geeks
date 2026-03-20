import bcrypt from 'bcrypt'
import ApiError from '../exceptions/api-error'
import UserDto from '../dto/user-dto'
import userModel, { UserDocument } from '../models/user-model'
import tokenService from './token-service'
import { AuthResponse } from '../types/auth'

class UserService {
	async registration(email: string, password: string): Promise<AuthResponse> {
		const candidate = await userModel.findOne({ email })

		if (candidate) {
			throw ApiError.BadRequest(`User with email ${email} already exists`)
		}

		const hashPassword = await bcrypt.hash(password, 3)
		const user = await userModel.create({
			email,
			password: hashPassword,
		})

		return this.buildAuthResponse(user)
	}

	async login(email: string, password: string): Promise<AuthResponse> {
		const user = await userModel.findOne({ email })

		if (!user) {
			throw ApiError.BadRequest(`User with email ${email} not found`)
		}

		const isPasswordEqual = await bcrypt.compare(password, user.password)
		if (!isPasswordEqual) {
			throw ApiError.BadRequest('Incorrect password')
		}

		return this.buildAuthResponse(user)
	}

	async logout(refreshToken?: string): Promise<{ deletedCount?: number }> {
		if (!refreshToken) {
			throw ApiError.UnauthorizedError()
		}

		const token = await tokenService.removeToken(refreshToken)
		return { deletedCount: token.deletedCount }
	}

	async refresh(refreshToken?: string): Promise<AuthResponse> {
		if (!refreshToken) {
			throw ApiError.UnauthorizedError()
		}

		const userData = tokenService.validateRefreshToken(refreshToken)
		const tokenFromDb = await tokenService.findToken(refreshToken)
		if (!userData || !tokenFromDb) {
			throw ApiError.UnauthorizedError()
		}

		const user = await userModel.findById(userData.id)
		if (!user) {
			throw ApiError.UnauthorizedError()
		}

		return this.buildAuthResponse(user)
	}

	async getAllUsers(): Promise<UserDocument[]> {
		return userModel.find()
	}

	private async buildAuthResponse(user: UserDocument): Promise<AuthResponse> {
		const userDto = new UserDto(user)
		const tokens = tokenService.generateTokens({ ...userDto })
		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return {
			...tokens,
			user: userDto,
		}
	}
}

export default new UserService()
