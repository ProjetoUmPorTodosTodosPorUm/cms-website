import type { FieldDto } from './field.dto'

export type AnnouncementDto = {
    id: string;
    title: string;
    message: string;
    attachments: string[];
    fixed: boolean;

    createdAt: Date;
    updatedAt: Date;
    deleted?: Date;

    fieldId?: string;
    field?: FieldDto;
}