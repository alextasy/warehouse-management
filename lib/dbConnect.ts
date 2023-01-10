// @ts-nocheck
import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGO_URI || '';
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

let mongoClient: MongoClient|null = null;
let database: Db|null = null;

if (!process.env.MONGO_URI) throw new Error('Please add your Mongo URI to .env.local');

export default async function connectToDatabase(): Promise<Db> {
  try {
    if (mongoClient && database) return database;
    
    if (!global.mongoClient) mongoClient = global.mongoClient = await (new MongoClient(uri, options)).connect(); 
    else mongoClient = global.mongoClient;

    database = await mongoClient.db('warehouse');
    
    return database;
  } catch (e) { console.error(e); }
}