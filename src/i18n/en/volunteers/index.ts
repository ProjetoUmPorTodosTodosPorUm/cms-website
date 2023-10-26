import type { NamespaceVolunteersTranslation } from '../../i18n-types'

const shared = {
	labels: {
		nameLabel: 'Name',
		firstNameLabel: 'First Name',
		lastNameLabel: 'Last Name',
		emailLabel: 'E-mail',
		joinedDateLabel: 'Joined Date',
		occupationLabel: 'Occupation',
		churchLabel: 'Church',
		priestLabel: 'Priest',
		observationLabel: 'Observation'
	},
	pageTitle: 'Volunteers',
	occupations: {
		president: 'President',
		vicePresident: 'Vice-President',
		geralCoordinator: 'General Coordinator',
		coordinator01: 'Coordinator 01',
		counselor01: 'Counselor 01',
		counselor02: 'Counselor 02',
		counselor03: 'Counselor 03',
		webMaster: 'Web Master',
		treasurer01: 'Treasurer 01',
		treasurer02: 'Treasurer 02',
		academicInstructor01: 'Academic Instructor 01',
		academicInstructor02: 'Academic Instructor 02',
		executiveSecretary: 'Executive Secretary',
		auxiliarySecretary: 'Auxiliary Secretary',
		coordinator02: 'Coordinator 02',
		infieldCoordinator: 'Infield Coordinator',
		outfieldCoordinator: 'Outfield Coordinator',
		collector: 'Collector',
		supportService: 'Suport Service'
	},
	profilePic: {
		altText: 'Profile pic',
		editText: 'Edit'
	}
}

const en_volunteers = {
	list: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Volunteers',
			buttonText: 'Add Volunteer'
		},
		collectionHeader: shared.labels
	},

	add: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Add Volunteer',
			buttonText: 'Save'
		},
		inputs: shared.labels,
		occupations: shared.occupations,
		profilePic: shared.profilePic
	},

	edit: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Edit Volunteer',
			buttonText: 'Save'
		},
		inputs: shared.labels,
		occupations: shared.occupations,
		profilePic: shared.profilePic
	}
} satisfies NamespaceVolunteersTranslation

export default en_volunteers
