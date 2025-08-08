import { FastifyInstance } from "fastify";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifySwagger from "@fastify/swagger";
import path from "path";

const setupSwagger = async (app: FastifyInstance) => {
    const swaggerPath = path.join(process.cwd(), "openapi.yaml");
    const swaggerDir = process.cwd();

    await app.register(fastifySwagger, {
        mode: 'static',
        specification: {
            path: swaggerPath,
            baseDir: swaggerDir
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