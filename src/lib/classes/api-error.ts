import type { ApiResponseDto } from '$types'

export class ApiError extends Error {
	public data: any | undefined
	public timestamp = ''
	public status: number

	constructor(apiResponse: ApiResponseDto, status = 0) {
		super(apiResponse.message)
		this.data = apiResponse.data
		this.timestamp = apiResponse.timestamp
		this.status = status
	}
}
