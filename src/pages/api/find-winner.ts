import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors'
import { findWinner } from 'piskvorky'
import { catchError } from '../../../utilities/catchError'

type Data =
	| {
			winner: ReturnType<typeof findWinner>
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

	const winner = catchError(() => findWinner(data.board))

	if (winner.result !== null) {
		response.status(200).json({
			winner: winner.result,
		})
		return
	}

	response.status(400).json({ error: winner.error })
}
