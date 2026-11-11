import {createPool} from 'mysql2/promise';
import dotenv from 'dotenv';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

dotenv.config({
    path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env')
});

const requiredEnv = (name: string): string => {
    const value = process.env[name];
    if (value === undefined || value.trim() === '') {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
};

const password = process.env.DB_PASSWORD;
if (password === undefined) {
    throw new Error('Missing required environment variable: DB_PASSWORD');
}

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
