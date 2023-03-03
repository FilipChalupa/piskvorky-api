export const catchError = <Result>(
	run: () => Result,
):
	| {
			result: Result
			error: null
	  }
	| {
			result: null
			error: string
	  } => {
	try {
		return { result: run(), error: null }
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : 'Unknown error.',
			result: null,
		}
	}
}
