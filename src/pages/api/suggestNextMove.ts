import type { NextApiRequest, NextApiResponse } from 'next'

type Data =
	| {
			status: 'ok'
	  }
	| {
			error: string
	  }

export default function handler(
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) {
	const data = request.body

	if (data.board) {
		response.status(200).json({
			status: 'ok',
		})
		return
	}

	response.status(400).json({ error: 'Unknown request' })
}
