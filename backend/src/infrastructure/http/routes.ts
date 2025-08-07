import { FastifyInstance } from "fastify";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import wordRoutes from "./routes/word.route.js";

const registerRoutes = async (app: FastifyInstance) => {

    app.get("/", {
        schema: {
            summary: "Welcome message",
            tags: ["Home"],
            response: {
                200: {
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    },
                    required: ["message"]
                }
            }
        }
    }, (request, reply) => {
        reply.send({ message: "Fullstack Challenge 🏅 - Dictionary" });
    });

    app.register(authRoutes, { prefix: "/auth" });
    app.register(userRoutes, { prefix: "/user" });
    app.register(wordRoutes, { prefix: "/entries" });

    app.setErrorHandler((error, request, reply) => {
        request.log.error(error);
        reply.code(500).send({ message: error.message });
    });
};

export default registerRoutes;