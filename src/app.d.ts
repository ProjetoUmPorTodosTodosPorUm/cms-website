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
			user: UserDto | null
		}

		interface PageData {
			user: UserDto | null
			fields?: FieldDto[]
		}

		// interface Platform {}
	}
}

export {}
