import type { FieldDto } from './field.dto'
import type { ChurchType } from '../enums';


export type ChurchDto = {
    id: string;
    name: string;
    description: string;
    images: string[];
    type: ChurchType;

    createdAt: string;
    updatedAt: string;
    deleted?: string;

    fieldId: string;
    field: FieldDto | string | null;
}