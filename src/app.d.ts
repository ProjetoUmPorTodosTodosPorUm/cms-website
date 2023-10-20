import type { Locales, TranslationFunctions } from './i18n/i18n-types'
import type { FieldDto, UserDto } from './lib/types'

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			message: string
			status: number
		}

		interface Locals {
			locale: Locales
			LL: TranslationFunctions
			user: UserDto | null
		}

		interface PageData {
			locale: Locales
			user: UserDto
			fields?: FieldDto[] 
		}

		// interface Platform {}
	}
}

export { }
