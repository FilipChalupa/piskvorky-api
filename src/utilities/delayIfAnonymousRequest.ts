import { NextApiRequest } from 'next'
import { delay } from './delay'

const isAuthorized = (request: NextApiRequest) => {
	const { authorization } = request.headers
	if (authorization === undefined) {
		return false
	}
	return true
}

export const delayIfAnonymousRequest = async (request: NextApiRequest) => {
	if (!isAuthorized(request)) {
		await delay(3000)
	}
}
