import type { FieldDto } from './field.dto'

export type AnnouncementDto = {
	id: string
	title: string
	message: string
	attachments: string[]
	fixed: boolean

	createdAt: string
	updatedAt: string
	deleted?: string

	fieldId: string
	field: FieldDto | string | null
}
