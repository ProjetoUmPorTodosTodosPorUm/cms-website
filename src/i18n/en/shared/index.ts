import type { NamespaceSharedTranslation } from '../../i18n-types'

const en_shared = {
	// List Pages
	collectionHeader: {
		createdAtLabel: 'Created At',
		updatedAtLabel: 'Updated At',
		deletedLabel: 'Deleted At'
	},

	remove: {
		users: "Do you want to remove {email}'s account?",
		files: 'Do you want to remove the file {name}?',
		logs: 'Do you want to remove the entry at {createdAt}?',
		agenda: 'Do you want to remove the event {title}?',
		announcements: 'Do you want to remove the announcement {title}?',
		testimonials: "Do you want to remove {name}'s testimonial?",
		reports: 'Do you want to remove the report {title}?',
		'offeror-families': 'Do you want to remove the offeror family represented by {name}?',
		'welcomed-families': 'Do you want to remove the welcomed family representate by {name}?',
		fields: 'Do you want to remove the missionary field {designation}?',
		churches: 'Do you want to remove the church {name}?',
		collaborators: 'Do you want to remove the collaborator {title}?',
		'collected-offers': 'Do you want to remove the collected offer from {month}/{year}?',
		volunteers: 'Do you want to remove the volunteer {name}?',
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

	inputFile: {
		chooseFile: 'Choose File',
        chooseFiles: 'Choose Files'
	}

} satisfies NamespaceSharedTranslation

export default en_shared
