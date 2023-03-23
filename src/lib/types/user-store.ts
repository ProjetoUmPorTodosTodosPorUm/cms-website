import type { UserDto } from './user.dto';

export type UserStore = {
    accessToken: string;
    refreshToken: string;
    user: UserDto;
    isUserLogged: boolean;
    tokenValidated: number;
    isReady: boolean;
}
