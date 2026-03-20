const toPort = (value: string | undefined, fallback: number): number => {
	const port = Number(value)
	return Number.isInteger(port) && port > 0 ? port : fallback
}

export const PORT = toPort(process.env.PORT, 8000)
export const MONGO_URI =
	process.env.MONGO_URI ??
	'mongodb+srv://thedolbekov2_db_user:BgaeoBbyGwgxWVwe@cluster0.blbqszk.mongodb.net/?appName=Cluster0'
export const JWT_ACCESS_SECRET =
	process.env.JWT_ACCESS_SECRET ?? 'access-secret-key'
export const JWT_REFRESH_SECRET =
	process.env.JWT_REFRESH_SECRET ?? 'refresh-secret-key'
