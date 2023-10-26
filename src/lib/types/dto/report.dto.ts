import type { FieldDto } from './field.dto'
import type { ReportType } from '../enums'

export type ReportDto = {
	id: string
	title: string
	text?: string
	shortDescription: string
	attachments: string[]
	month: number | null
	year: number
	type: ReportType

	createdAt: string
	updatedAt: string
	deleted?: string

	fieldId: string
	field: FieldDto | string | null
}
