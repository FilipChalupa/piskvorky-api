import type { NextApiRequest, NextApiResponse } from 'next'
import { suggestNextMove } from 'piskvorky'

type Data =
	| {
			position: ReturnType<typeof suggestNextMove>
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
	const position = suggestNextMove(data.board)

	if (data.board) {
		response.status(200).json({
			position,
		})
		return
	}

	response.status(400).json({ error: 'Unknown request.' })
}
