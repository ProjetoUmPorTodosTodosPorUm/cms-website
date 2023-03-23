/// <reference path="../../../node_modules/@types/google.maps/index.d.ts" />
import type { CollectionPoint } from './collection-point';

export type FieldDto = {
    id: string;
    continent: string;
    country: string;
    state: string;
    abbreviation: string;
    designation: string;
    mapLocation?: google.maps.MapOptions;
    mapArea?: google.maps.PolygonOptions[];
    collectionPoints?: CollectionPoint[];
    streetRelation?: string[];

    createdAt: Date;
    updatedAt: Date;
    deleted?: Date;
}