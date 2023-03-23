import type { FieldDto } from "./field.dto";
import type { Occupation } from '../enums';

export type VolunteerDto = {
    id: string;
    firstName: string;
    lastName?: string;
    email?: string;
    avatar?: string;
    joinedDate: Date;
    occupation: Occupation;
    church?: string;
    priest?: string;
    observation?: string;

    createdAt: Date;
    updatedAt: Date;
    deleted?: Date;

    fieldId: string;
    field: FieldDto;
}