import type { NextApiRequest, NextApiResponse } from 'next'
import { suggestNextMove } from 'piskvorky'
import { catchError } from '../../../utilities/catchError'

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

	const position = catchError(() => suggestNextMove(data.board))

	if (position.result !== null) {
		response.status(200).json({
			position: position.result,
		})
		return
	}

	response.status(400).json({ error: position.error })
}
