import { UserDocument } from '../models/user-model'
import { TokenPayload } from '../types/auth'

class UserDto implements TokenPayload {
	id: string
	email: string

	constructor(model: UserDocument) {
		this.id = model._id.toString()
		this.email = model.email
	}
}

export default UserDto
