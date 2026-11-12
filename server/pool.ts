//For creating a MySQL connection pool
import {createPool} from 'mysql2/promise';
// Loading variables from .env
import dotenv from 'dotenv';
//dirname() - Extracts the directory portion of a file path
//resolve() - resolves a sequeunce of path segments 
//            into an absolute path
import {dirname, resolve} from 'node:path';
//Turns URL string/object into a filesystem path
import {fileURLToPath} from 'node:url';

// Set path to get to .env variables
dotenv.config({
    path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env')
});

// Get the environment variable name
const requiredEnv = (name: string): string => {
    const value = process.env[name];
    if (value === undefined || value.trim() === '') {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
};

// Get password from .env and make sure it's there
const password = process.env.DB_PASSWORD;
if (password === undefined) {
    throw new Error('Missing required environment variable: DB_PASSWORD');
}

// Our final little mySQL connection pool
const pool = createPool({
    host: requiredEnv('DB_HOST'),
    user: requiredEnv('DB_USER'),
    password,
    database: requiredEnv('DB_NAME'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
