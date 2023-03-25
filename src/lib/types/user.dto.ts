import type { Role } from '$lib/enums';
import type { FieldDto } from "$lib/types/field.dto";

export type UserDto = {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string;
    role: Role;
    avatar: string | null;
    lastAccess: string | null;

    createdAt?: string;
    updatedAt?: string;
    deleted?: string;
    restricted?: string;

    fieldId?: string;
    field?: FieldDto | null;
}