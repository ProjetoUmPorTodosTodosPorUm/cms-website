import type { FieldDto } from './field.dto'
export type FileDto = {
    id: string;
    name: string;
    mimeType: string;
    size: number;

    createdAt: Date;
    deleted?: Date;

    fieldId?: string;
    field?: FieldDto;
}