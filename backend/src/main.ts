import dotenv from 'dotenv';
import server from "./server.js";

// Load environment variables
dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 3030;

const start = async () => {
    try {
        await server.listen({
            host: '0.0.0.0',
            port: Number(PORT)
        });
        server.log.info(`Server running on port ${PORT}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();