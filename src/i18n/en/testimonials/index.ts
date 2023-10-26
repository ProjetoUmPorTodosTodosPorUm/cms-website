import type { NamespaceTestimonialsTranslation } from '../../i18n-types'

const shared = {
	labels: {
		nameLabel: 'Name',
		emailLabel: 'E-mail',
		textLabel: 'Text'
	},
	pageTitle: 'Testimonials'
}

const en_testimonials = {
	list: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Testimonials',
			buttonText: 'Add Testimonial'
		},
		collectionHeader: shared.labels
	},

	add: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Add Testimonial',
			buttonText: 'Save'
		},
		inputs: shared.labels
	},

	edit: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Edit Testimonial',
			buttonText: 'Save'
		},
		inputs: shared.labels
	}
} satisfies NamespaceTestimonialsTranslation

export default en_testimonials
