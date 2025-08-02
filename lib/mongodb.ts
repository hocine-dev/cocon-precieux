import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/cocon-precieux";
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

if (!process.env.MONGODB_URI) {
  // console.warn("MONGODB_URI n'est pas défini dans .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri, options);
  }
  client = global._mongoClient;
  clientPromise = client.connect().then(() => client);
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect().then(() => client);
}

export default clientPromise;