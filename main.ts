import { MongoClient } from 'mongodb';

const MONGO_URL = Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  throw new Error("MONGO_URL is not provided");
  Deno.exit();
}

const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("Connected to MongoDB");

const db = client.db("niños");

const handler = async (req: Request): Promise<Response> => {
  const method = req.method;
  const url = new URL(req.url);
  const path = url.pathname;

  if (method === "GET"){
    if (path === "/entregas"){

    } else if (path === "/ruta"){

    }
  } else if (method === "POST"){
    if (path === "/ubicacion"){
      
    }
  }

  return new Response("Endpoint not found", { status: 404 });
}

Deno.serve({port: 3000}, handler)