import type { FieldDto } from './field.dto'
import type { Occupation } from '../enums'

export type VolunteerDto = {
	id: string
	firstName: string
	lastName?: string
	email?: string
	avatar?: string
	joinedDate: string
	occupation: Occupation
	church?: string
	priest?: string
	observation?: string

	createdAt: string
	updatedAt: string
	deleted?: string

	fieldId: string
	field: FieldDto | string | null
}
