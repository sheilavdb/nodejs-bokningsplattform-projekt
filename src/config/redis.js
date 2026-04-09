import { createClient } from "redis";
import logger from "../utils/logger.js"

const redis = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redis.on('error', (error) => {
    logger.error(`Redis-fel: ${error.message}`);
});

redis.on('connect', () => {
    logger.info('Redis ansluten');
});

try {
await redis.connect();
} catch (error) {
    logger.error(`Kunde inte ansluta till Redis: ${error.message}`);
}

export default redis;
