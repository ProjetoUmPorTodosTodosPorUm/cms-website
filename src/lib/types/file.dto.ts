import type { FieldDto } from './field.dto'
export type FileDto = {
    id: string;
    name: string;
    mimeType: string;
    size: number;

    createdAt: string;
    deleted?: string;

    fieldId?: string;
    field?: FieldDto | string | null;
}