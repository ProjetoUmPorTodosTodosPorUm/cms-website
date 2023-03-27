import type { OfferorFamilyGroup } from "../enums";
import type { FieldDto } from "./field.dto";

export type OfferorFamilyDto = {
    id: string;
    representative: string;
    commitment: string;
    churchDenomination?: string;
    group: OfferorFamilyGroup;

    createdAt: string;
    updatedAt: string;
    deleted?: string;

    fieldId: string;
    field: FieldDto | string | null;
}