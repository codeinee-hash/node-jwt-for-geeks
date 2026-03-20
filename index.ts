import cors from 'cors'
import cookieParser from 'cookie-parser'
import express from 'express'
import mongoose from 'mongoose'
import router from './router'
import { MONGO_URI, PORT } from './constants/environment'
import errorMiddleware from './middleware/error-middleware'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use('/api', router)
app.use(errorMiddleware)

const run = async (): Promise<void> => {
	try {
		await mongoose.connect(MONGO_URI)
		console.log('Connected to MongoDB')

		const server = app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`)
		})

		server.on('error', error => {
			if ('code' in error && error.code === 'EADDRINUSE') {
				console.error(`Port ${PORT} is already in use`)
				return
			}

			console.error('Server error:', error)
		})
	} catch (error) {
		console.error('Error starting server:', error)
	}
}

void run()
