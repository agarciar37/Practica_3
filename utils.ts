import type { Collection } from "mongodb";
import { KidModel, LocationModel } from "./types.ts";
import { Kid, Location } from "./types.ts";

export const fromModelToKid = async (
    kidDB: KidModel,
    locationCollection: Collection<LocationModel>
): Promise<Kid> => {
    const location = await locationCollection.findOne({ _id: kidDB.ubicacion });
    if (!location) {
        throw new Error("Location not found");
    }
    return {
        id: kidDB._id!.toString(),
        name: kidDB.name,
        behavior: kidDB.behavior,
        ubicacion: fromModelToLocation(location),
    };
}

export const fromModelToLocation = (model: LocationModel): Location => ({
    id: model._id!.toString(),
    name: model.name,
    coordenadas: model.coordenadas,
    goodKids: model.goodKids,
});

export const validateCoordinates = (lat: number, lon: number): boolean => {
    return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
};

export const haversine = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radio de la Tierra en km
    const toRad = (deg: number) => (deg * Math.PI) / 180; // Conversión a radianes

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const lat1Rad = toRad(lat1);
    const lat2Rad = toRad(lat2);

    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distancia en km
};
