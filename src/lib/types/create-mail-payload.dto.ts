import type { Role } from '../enums';

export type CreateMailPayloadDto = {
    field?: string | null;
    role: Role | null;
}