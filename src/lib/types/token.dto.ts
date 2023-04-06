import type { TokenType } from '../enums';

export type TokenDto = {
    id: string;
    token: string;
    email: string;
    used: boolean;
    tokenType: TokenType;
    payload?: JSON;
    expiration: number;

    createdAt: string;
    updatedAt: string;
    deleted?: string;
}