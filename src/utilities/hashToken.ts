import { createHash } from 'crypto'

export const hashToken = (token: string) => {
	return createHash('md5').update(token).digest('hex')
}
