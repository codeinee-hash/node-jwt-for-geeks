import { HydratedDocument, Schema, Types, model } from 'mongoose'

export interface Token {
	user: Types.ObjectId
	refreshToken: string
}

const tokenSchema = new Schema<Token>({
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	refreshToken: { type: String, required: true },
})

const TokenModel = model<Token>('Token', tokenSchema)

export type TokenDocument = HydratedDocument<Token>

export default TokenModel
