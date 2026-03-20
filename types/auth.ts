export interface TokenPayload {
	id: string
	email: string
}

export interface Tokens {
	accessToken: string
	refreshToken: string
}

export interface AuthResponse extends Tokens {
	user: TokenPayload
}
