import { MongoClient, ServerApiVersion } from 'mongodb';

// Create a client 
const client = new MongoClient(process.env.CONNECTION_STRING, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Establish the connection to the database
const connection = client.connect();

// Export connection and client
export { connection, client };
