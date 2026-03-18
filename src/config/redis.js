import { createClient } from "redis";
import logger from "../utils/logger.js"

const client = createClient({
    socket: {
        host: 'localhost',
        port: 6379
    }
});

client.on('error', (error) => {
    logger.error(`Redis-fel: ${error.message}`);
});

client.on('connect', () => {
    logger.info('Redis ansluten');
});

await client.connect();

export default client;
