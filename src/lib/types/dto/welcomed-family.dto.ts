import type { FieldDto } from './field.dto'

export type WelcomedFamilyDto = {
	id: string
	representative: string
	observation: string

	createdAt: string
	updatedAt: string
	deleted?: string

	fieldId: string
	field: FieldDto | string | null
}
