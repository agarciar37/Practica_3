import type { ObjectId, OptionalId } from "mongodb";

export type KidModel = OptionalId<{
    name: string;
    behavior: "bueno" | "malo";
    ubicacion: ObjectId;
}>;

export type Kid = {
    id: string;
    name: string;
    behavior: "bueno" | "malo";
    ubicacion: Location;
}

export type LocationModel = OptionalId<{
    name: string;
    coordenadas: {
        lat: number;
        lon: number;
    };
    goodKids: number;
}>;

export type Location = {
    id: string;
    name: string;
    coordenadas: {
        lat: number;
        lon: number;
    };
    goodKids: number;
}