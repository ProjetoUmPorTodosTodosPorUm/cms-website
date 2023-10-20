import type { UserDto } from './user.dto';

export type LogDto = {
    id: string;
    ip: string;
    method: string;
    url: string;
    body?: JSON;
    files: string[];
    query?: string;
    statusCode: string;
    user: UserDto | null;

    createdAt: string;
    deleted?: string;
}