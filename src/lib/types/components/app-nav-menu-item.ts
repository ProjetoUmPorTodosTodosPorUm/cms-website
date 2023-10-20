import type { Role } from '$enums/role'

export type AppNavMenuItem = {
	name: string
	href: string
	icon: any
	role?: Role
}
