import { FastifyInstance } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import { openapi } from "./openapi.js";

const setupSwagger = async (app: FastifyInstance) => {
    await app.register(fastifySwagger, { openapi });

    await app.register(fastifySwaggerUI, {
        routePrefix: "/docs",
        uiConfig: {
            docExpansion: "list",
            deepLinking: false,
        },
    });
}

export default setupSwagger