import type { NamespaceSharedTranslation } from '../../i18n-types'

const en_shared = {
	// List Pages
	collectionHeader: {
		createdAtLabel: 'Created At',
		updatedAtLabel: 'Updated At',
		deletedLabel: 'Deleted At'
	},

	remove: {
		user: "Do you want to remove {email}'s account?",
		file: 'Do you want to remove the file {name}?',
		log: 'Do you want to remove the entry at {createdAt}?',
		agenda: 'Do you want to remove the event {title}?',
		announcement: 'Do you want to remove the announcement {title}?',
		testimonial: "Do you want to remove {name}'s testimonial?",
		report: 'Do you want to remove the report {title}?',
		offerorFamily: 'Do you want to remove the offeror family represented by {name}?',
		welcomedFamily: 'Do you want to remove the welcomed family representate by {name}?',
		field: 'Do you want to remove the missionary field {designation}?',
		church: 'Do you want to remove the church {name}?',
		collaborator: 'Do you want to remove the collaborator {title}?',
		collectedOffer: 'Do you want to remove the collected offer from {month}/{year}?',
		volunteer: 'Do you want to remove the volunteer {name}?',
	},

	isStatusTransform: {
		true: 'Yes',
		false: 'No'
	},

	// Add && Edit Pages
	yup: {
		required: '{field} is a required field.',
		oneOf: 'You must choose between values: {enums}.',
		min: '{field} must have at least {length} characters.',
		max: '{field} must have at most {length} characters.',
		minNumber: '{field} must be at least {value}.',
		maxNumber: '{field} must be at most {value}.',
		number: '{field} must be a valid number.',
		integer: '{field} must be a valid integer.',
		email: '{field} must be a valid e-mail.'
	},

	axios: {
		fileSizeError: 'Files are too big!',
		serverNotAvailable: 'Server not Available.'
	},

	inputs: {
		fieldLabel: 'Missionary Field'
	},

} satisfies NamespaceSharedTranslation

export default en_shared
