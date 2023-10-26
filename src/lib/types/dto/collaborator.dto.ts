import type { FieldDto } from './field.dto'

export type CollaboratorDto = {
	id: string
	title: string
	description: string
	image: string

	createdAt: string
	updatedAt: string
	deleted?: string

	fieldId: string
	field: FieldDto | string | null
}
