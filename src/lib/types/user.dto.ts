import type { Role } from '$lib/enums';
import type { FieldDto } from "$lib/types/field.dto";

export type UserDto = {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string;
    role: Role;
    avatar: string | null;
    lastAccess: Date | null;

    createdAt?: Date;
    updatedAt?: Date;
    deleted?: Date;
    restricted?: Date;

    fieldId?: string;
    field?: FieldDto | null;
}