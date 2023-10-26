import type { FieldDto } from './field.dto'

export type TestimonialDto = {
	id: string
	name: string
	email?: string
	text: string

	createdAt: string
	updatedAt: string
	deleted?: string

	fieldId: string
	field: FieldDto | string | null
}
