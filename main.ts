import { MongoClient } from 'mongodb';
import { addKid, addLocation, getGoodKids, getBadKids, getDeliveries, getRoute } from "./resolvers.ts";
import { KidModel, LocationModel } from "./types.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");
if (!MONGO_URL){
  throw new Error("MONGO_URL is not provided");
  Deno.exit(1);
}

const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("Connected to MongoDB");

const db = client.db("niños");

const kidCollection = db.collection<KidModel>("kids");
const locationCollection = db.collection<LocationModel>("ubicaciones");

const handler = async (req: Request): Promise<Response> => {
  const method = req.method;
  const url = new URL(req.url);
  const path = url.pathname;

  if (method === "POST"){
    if (path === "/location"){
      const { name, coordenadas } = await req.json();
      await addLocation(locationCollection, name, coordenadas);
      return new Response("Location added", { status: 201 });
    } else if (path === "/kid") {
      const { name, behavior, ubicacion } = await req.json();
      await addKid(kidCollection, locationCollection, name, behavior, ubicacion);
      return new Response("Kid added", { status: 201 });
    }
  } else if (method === "GET") {
    if (path === "/kids/buenos"){
      const kids = await getGoodKids(kidCollection, locationCollection);
      return new Response(JSON.stringify(kids), { status: 200 });
    } else if (path === "/kids/malos") {
      const kids = await getBadKids(kidCollection, locationCollection);
      return new Response(JSON.stringify(kids), { status: 200 });
    } else if (method === "GET" && path === "/entregas") {
      const deliveries = await getDeliveries(locationCollection);
      return new Response(JSON.stringify(deliveries), { status: 200 });
    } else if (path === "/ruta") {
      const distance = await getRoute(locationCollection);
      return new Response(JSON.stringify({ distance }), { status: 200 });
    }
  }

  return new Response("Endpoint Not Found", { status: 404 });
}

Deno.serve({ port: 6768 }, handler);