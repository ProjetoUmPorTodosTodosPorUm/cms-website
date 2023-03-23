import type { FieldDto } from './field.dto'
import type { ChurchType } from '../enums';


export type ChurchDto = {
    id: string;
    name: string;
    description: string;
    type: ChurchType;

    createdAt: Date;
    updatedAt: Date;
    deleted?: Date;

    fieldId?: string;
    field?: FieldDto;
}