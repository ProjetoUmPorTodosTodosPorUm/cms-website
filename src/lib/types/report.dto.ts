import type { FieldDto } from "./field.dto";
import type { ReportType } from '../enums';

export type ReportDto = {
    id: string;
    title: string;
    text?: string;
    shortDescription: string;
    attachments: string[];
    month?: number;
    year: number;
    type: ReportType;

    createdAt: Date;
    updatedAt: Date;
    deleted?: Date;

    fieldId: string;
    field: FieldDto;
}