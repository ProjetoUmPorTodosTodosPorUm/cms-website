import type { FieldDto } from './field.dto'

export type MonthlyOfferDto = {
	id: string
	month: number
	year: number
	foodQnt: number
	monetaryValue: number
	othersQnt: number

	createdAt: string
	updatedAt: string
	deleted?: string

	fieldId: string
	field: FieldDto | string | null
}
