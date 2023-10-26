import type { CreateMailPayloadDto } from './create-mail-payload.dto'

export type SendCreateEmailDto = {
	email: string
	name: string
	payload: CreateMailPayloadDto
}
