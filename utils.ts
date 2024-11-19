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
})