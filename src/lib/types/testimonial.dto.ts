import type { FieldDto } from './field.dto'

export type TestimonialDto = {
    id: string;
    name: string;
    email?: string;
    text: string;

    createdAt: Date;
    updatedAt: Date;
    deleted?: Date;

    fieldId?: string;
    field?: FieldDto;
}