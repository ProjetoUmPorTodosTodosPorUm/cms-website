import type { OfferorFamilyGroup } from "../enums";
import type { FieldDto } from "./field.dto";

export type OfferorFamilyDto = {
    id: string;
    representative: string;
    commitment: string;
    chuchDenomination?: string;
    group: OfferorFamilyGroup;

    createdAt: Date;
    updatedAt: Date;
    deleted?: Date;

    fieldId: string;
    field: FieldDto;
}