import type { NextApiRequest, NextApiResponse } from 'next'
import { findWinner } from 'piskvorky'

type Data =
	| {
			winner: ReturnType<typeof findWinner>
	  }
	| {
			error: string
	  }

export default function handler(
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) {
	const data = request.body

	// @TODO: handle errors
	const winner = findWinner(data.board)

	if (data.board) {
		response.status(200).json({
			winner,
		})
		return
	}

	response.status(400).json({ error: 'Unknown request.' })
}
