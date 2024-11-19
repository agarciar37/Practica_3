import { Collection, ObjectId } from "mongodb";
import { KidModel, LocationModel } from "./types.ts";
import { fromModelToKid, fromModelToLocation, validateCoordinates, haversine } from "./utils.ts";

// Agregar ubicación
export const addLocation = async (locationCollection: Collection<LocationModel>, name: string, coordenadas: { lat: number, lon: number }) => {
    if (!validateCoordinates(coordenadas.lat, coordenadas.lon)) {
        throw new Error("Invalid coordinates");
    }

    const existingLocation = await locationCollection.findOne({ name });
    if (existingLocation) {
        throw new Error("Location name already exists");
    }

    const result = await locationCollection.insertOne({
        name,
        coordenadas,
        goodKids: 0,
    });

    return result;
};

// Agregar niño
export const addKid = async (kidCollection: Collection<KidModel>, locationCollection: Collection<LocationModel>, name: string, behavior: "bueno" | "malo", ubicacion: string) => {
    const existingKid = await kidCollection.findOne({ name });
    if (existingKid) {
        throw new Error("Kid name already exists");
    }

    const location = await locationCollection.findOne({ _id: new ObjectId(ubicacion) });
    if (!location) {
        throw new Error("Location not found");
    }

    await kidCollection.insertOne({
        name,
        behavior,
        ubicacion: location._id,
    });

    if (behavior === "bueno") {
        await locationCollection.updateOne(
            { _id: location._id },
            { $inc: { goodKids: 1 } }
        );
    }
};

// Obtener niños buenos
export const getGoodKids = async (kidCollection: Collection<KidModel>, locationCollection: Collection<LocationModel>) => {
    const kids = await kidCollection.find({ behavior: "bueno" }).toArray();
    return Promise.all(kids.map(kid => fromModelToKid(kid, locationCollection)));
};

// Obtener niños malos
export const getBadKids = async (kidCollection: Collection<KidModel>, locationCollection: Collection<LocationModel>) => {
    const kids = await kidCollection.find({ behavior: "malo" }).toArray();
    return Promise.all(kids.map(kid => fromModelToKid(kid, locationCollection)));
};

// Orden de entregas
export const getDeliveries = async (locationCollection: Collection<LocationModel>) => {
    const locations = await locationCollection.find().sort({ goodKids: -1 }).toArray();
    return locations.map(fromModelToLocation);
};

// Ruta de entrega
export const getRoute = async (locationCollection: Collection<LocationModel>) => {
    const locations = await locationCollection.find().sort({ goodKids: -1 }).toArray();

    let totalDistance = 0;
    for (let i = 0; i < locations.length - 1; i++) {
        const { lat: lat1, lon: lon1 } = locations[i].coordenadas;
        const { lat: lat2, lon: lon2 } = locations[i + 1].coordenadas;
        totalDistance += haversine(lat1, lon1, lat2, lon2);
    }

    return totalDistance;
};
