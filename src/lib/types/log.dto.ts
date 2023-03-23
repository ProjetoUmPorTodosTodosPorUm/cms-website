import type { UserDto } from './user.dto';
import type { FieldDto } from './field.dto'

export type LogDto = {
    id: string;
    ip: string;
    method: string;
    url: string;
    body?: JSON;
    files: string[];
    query?: string;
    statusCode: string;
    user: UserDto;

    createdAt: Date;
    deleted?: Date;
}