import { NextApiRequest } from 'next'
import { delay } from './delay'
import { hashToken } from './hashToken'
import { prisma } from './prisma'

const meEndpoint = process.env.KODIM_API_BASE_URL + '/me'

type CountToIncrement = 'findWinnerCount' | 'suggestNextMoveCount'

const isAuthorized = async (
	request: NextApiRequest,
	countToIncrement: CountToIncrement,
) => {
	const { authorization } = request.headers
	if (authorization === undefined) {
		return false
	}
	const [authorizationType, token] = authorization.split(' ')
	if (authorizationType !== 'Bearer') {
		return false
	}
	const user = await getUser(token)
	if (user === null) {
		return false
	}

	await prisma.user.update({
		where: {
			id: user.id,
		},
		data: {
			findWinnerCount: {
				increment: countToIncrement === 'findWinnerCount' ? 1 : 0,
			},
			suggestNextMoveCount: {
				increment: countToIncrement === 'suggestNextMoveCount' ? 1 : 0,
			},
		},
	})

	return true
}

const getUser = async (token: string) => {
	const hashedToken = hashToken(token)
	const user = await prisma.user.findUnique({
		where: {
			lastTokenHash: hashedToken,
		},
	})
	if (user !== null) {
		return user
	}

	const response = await fetch(meEndpoint, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
	if (response.ok === false) {
		return null
	}
	const { id, name, email } = await response.json()
	const upsertedUser = await prisma.user.upsert({
		where: {
			id,
		},
		create: {
			email,
			id,
			name,
			lastTokenHash: hashedToken,
		},
		update: {
			email,
			name,
			lastTokenHash: hashedToken,
		},
	})

	return upsertedUser
}

export const delayIfAnonymousRequest = async (
	request: NextApiRequest,
	countToIncrement: CountToIncrement,
) => {
	if (!(await isAuthorized(request, countToIncrement))) {
		await delay(3000)
	}
}
