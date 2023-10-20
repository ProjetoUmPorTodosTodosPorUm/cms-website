import { BaseStore } from '$stores/base'
import type { UserStore as UserStoreType, UserDto } from '$types'
import { Role } from '$enums'

export class UserStore extends BaseStore<UserStoreType> {
	static storeDefault = {
		id: '',
		firstName: '',
		lastName: '',
		email: '',
		role: Role.VOLUNTEER,
		avatar: null,
		fieldId: undefined,
		lastAccess: null
	}

	constructor(user: UserStoreType | null = null) {
		super(user ?? UserStore.storeDefault)
		this.init()
	}

	async init() {
		const user = this.getFromLocalStorage('user')

		if (user) {
			this.updateUser(user)
		}
	}

	updateUser(userData: UserDto) {
		this.store.update((data) => ({
			...data,
			...userData
		}))
		this.saveToLocalStorage('user', userData)
	}

	eraseStore() {
		this.store.set(UserStore.storeDefault)
		this.saveToLocalStorage('user', null)
	}

	isVolunteer() {
		return this.get().role === Role.VOLUNTEER
	}

	isAdmin() {
		return this.get().role === Role.ADMIN
	}

	isWebMaster() {
		return this.get().role === Role.WEB_MASTER
	}

	isLoggedIn() {
		return this.get().lastAccess !== null
	}
}
