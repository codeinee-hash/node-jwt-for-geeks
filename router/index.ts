import { Router } from 'express'
import { body } from 'express-validator'
import userController from '../controllers/user-controller'
import authMiddleware from '../middleware/auth-middleware'

const router = Router()

router.post(
	'/register',
	[
		body('email')
			.isEmail()
			.withMessage('Email must be a valid email address')
			.normalizeEmail(),
		body('password')
			.isLength({ min: 3, max: 30 })
			.withMessage('Password must be between 3 and 30 characters'),
	],
	userController.registration,
)

router.post(
	'/login',
	[
		body('email')
			.isEmail()
			.withMessage('Email must be a valid email address')
			.normalizeEmail(),
		body('password')
			.isLength({ min: 3, max: 30 })
			.withMessage('Password must be between 3 and 30 characters'),
	],
	userController.login,
)

router.post('/logout', userController.logout)
router.get('/refresh', userController.refresh)
router.get('/users', authMiddleware, userController.getUsers)

export default router
