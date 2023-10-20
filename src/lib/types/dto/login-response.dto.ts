import type { UserDto } from './user.dto'

export type LoginResponseDto = {
	accessToken: string
	refreshToken: string
	user: UserDto
}
