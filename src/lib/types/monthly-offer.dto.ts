import type { FieldDto } from './field.dto'

export type MonthlyOfferDto = {
    id: string;
    month: number;
    year: number;
    foodQnt: number;
    monetaryValue: number;
    othersQnt: number;

    createdAt: Date;
    updatedAt: Date;
    deleted?: Date;

    fieldId: string;
    field: FieldDto;
}