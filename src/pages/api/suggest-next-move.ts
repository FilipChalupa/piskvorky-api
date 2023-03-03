import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors'
import { suggestNextMove } from 'piskvorky'
import { catchError } from '../../utilities/catchError'
import { delayIfAnonymousRequest } from '../../utilities/delayIfAnonymousRequest'

type Data =
	| {
			position: ReturnType<typeof suggestNextMove>
	  }
	| {
			error: string
	  }

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) {
	await NextCors(request, response, {
		methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
		origin: '*',
		optionsSuccessStatus: 200,
	})

	const data = request.body

	const position = catchError(() => suggestNextMove(data.board, data.player))

	await delayIfAnonymousRequest(request, 'suggestNextMoveCount')

	if (position.error === null) {
		response.status(200).json({
			position: position.result,
		})
		return
	}

	response.status(400).json({ error: position.error })
}
