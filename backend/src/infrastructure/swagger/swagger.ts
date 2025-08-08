import { FastifyInstance } from "fastify";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifySwagger from "@fastify/swagger";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setupSwagger = async (app: FastifyInstance) => {

    await app.register(fastifySwagger, {
        mode: 'static',
        specification: {
            path: path.join(__dirname, "openapi.yaml"),
            baseDir: __dirname
        }
    });

    await app.register(fastifySwaggerUI, {
        routePrefix: "/docs",
        uiConfig: {
            docExpansion: "list",
            deepLinking: false,
        }
    });
}

export default setupSwagger