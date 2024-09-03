export type ContactDto = {
	id: string
	name: string
	email: string
	message: string
	attachments?: string[]

	createdAt: string
	updatedAt: string
	deleted?: string
}
