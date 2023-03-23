import type { FieldDto } from './field.dto'

export type AgendaDto = {
    id: string;
    title: string;
    message: string;
    attachments: string[];
    date: Date;

    createdAt: Date;
    updatedAt: Date;
    deleted?: Date;

    fieldId?: string;
    field?: FieldDto;
}