import { HydratedDocument, Schema, model } from 'mongoose'

export interface User {
	email: string
	password: string
}

const userSchema = new Schema<User>({
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
})

const UserModel = model<User>('User', userSchema)

export type UserDocument = HydratedDocument<User>

export default UserModel
