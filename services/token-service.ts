import jwt, { JwtPayload } from 'jsonwebtoken'
import {
	ACCESS_TOKEN_EXPIRES_IN,
	JWT_ACCESS_SECRET,
	JWT_REFRESH_SECRET,
	REFRESH_TOKEN_EXPIRES_IN,
} from '../constants/environment'
import tokenModel, { TokenDocument } from '../models/token-model'
import { TokenPayload, Tokens } from '../types/auth'

const isTokenPayload = (
	value: string | JwtPayload,
): value is JwtPayload & TokenPayload => {
	if (typeof value === 'string') {
		return false
	}

	return typeof value.id === 'string' && typeof value.email === 'string'
}

class TokenService {
	generateAccessToken(payload: TokenPayload): string {
		return jwt.sign(payload, JWT_ACCESS_SECRET, {
			expiresIn: ACCESS_TOKEN_EXPIRES_IN,
		})
	}

	generateTokens(payload: TokenPayload): Tokens {
		const accessToken = this.generateAccessToken(payload)
		const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
			expiresIn: REFRESH_TOKEN_EXPIRES_IN,
		})

		return {
			accessToken,
			refreshToken,
		}
	}

	async saveToken(
		userId: string,
		refreshToken: string,
	): Promise<TokenDocument> {
		const tokenData = await tokenModel.findOne({ user: userId })
		if (tokenData) {
			tokenData.refreshToken = refreshToken
			return tokenData.save()
		}

		return tokenModel.create({ user: userId, refreshToken })
	}

	validateAccessToken(token: string): TokenPayload | null {
		try {
			const userData = jwt.verify(token, JWT_ACCESS_SECRET)
			return isTokenPayload(userData) ? userData : null
		} catch {
			return null
		}
	}

	validateRefreshToken(token: string): TokenPayload | null {
		try {
			const userData = jwt.verify(token, JWT_REFRESH_SECRET)
			return isTokenPayload(userData) ? userData : null
		} catch {
			return null
		}
	}

	async findToken(refreshToken: string): Promise<TokenDocument | null> {
		return tokenModel.findOne({ refreshToken })
	}

	async removeToken(refreshToken: string) {
		return tokenModel.deleteOne({ refreshToken })
	}
}

export default new TokenService()
