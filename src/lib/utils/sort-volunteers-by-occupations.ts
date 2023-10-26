import type { VolunteerDto } from 'types'
import type { Occupation } from '$enums'

// based on simple bubble sort
export function sortVolunteersByOccupations(volunteers: VolunteerDto[], occupations: Occupation[]) {
	let swapped = false

	for (var i = 0; i <= volunteers.length - 1; i++) {
		swapped = false
		for (var j = 0; j < volunteers.length - i - 1; j++) {
			let currOccIndex = occupations.indexOf(volunteers[j].occupation)
			let lastOccIndex = occupations.indexOf(volunteers[j + 1].occupation)
			if (currOccIndex > lastOccIndex) {
				// Swap them if the condition is true
				var temp = volunteers[j]
				volunteers[j] = volunteers[j + 1]
				volunteers[j + 1] = temp
				swapped = true
			}
		}

		if (!swapped) {
			return volunteers
		}
	}
	return volunteers
}
