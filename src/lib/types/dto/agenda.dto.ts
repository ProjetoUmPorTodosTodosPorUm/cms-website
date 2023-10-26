import type { FieldDto } from '../field.dto'

export type AgendaDto = {
	id: string
	title: string
	message: string
	attachments: string[]
	date: string

	createdAt: string
	updatedAt: string
	deleted?: string

	fieldId: string
	field: FieldDto | string | null
}
