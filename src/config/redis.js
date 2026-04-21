import { createClient } from "redis";
import logger from "../utils/logger.js"

const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (error) => {
    logger.error(`Redis-fel: ${error.message}`);
});

client.on('connect', () => {
    logger.info('Redis ansluten');
});

export const connectRedis = async () => {
    try {
        await client.connect();
        console.log('Redis connected');
    } catch (error) {
        logger.error(`Kunde inte ansluta till Redis: ${error.message}`);
        console.log('Redis error details:', error);
    }
};

export default client;