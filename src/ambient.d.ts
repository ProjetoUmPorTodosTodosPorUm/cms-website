import type { UserDto } from "./lib/types"

declare module 'svelte-kit-sessions' {
    interface SessionData {
        user: UserDto
        accessToken: string
        refreshToken: string
    }
}
