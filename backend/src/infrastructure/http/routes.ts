import { FastifyInstance } from "fastify";
import userRoutes from "@/infrastructure/http/routes/user.route.js";
import authRoutes from "@/infrastructure/http/routes/auth.route.js";
import wordRoutes from "./routes/word.route.js";

const registerRoutes = async (app: FastifyInstance) => {

    app.get("/", () => ({
        message: "Fullstack Challenge 🏅 - Dictionary"
    }));

    app.register(authRoutes, { prefix: "/auth" });
    app.register(userRoutes, { prefix: "/user" });
    app.register(wordRoutes, { prefix: "/entries" });

    app.setErrorHandler((error, request, reply) => {
        request.log.error(error);
        reply.code(500).send({ error: error.message });
    });
};

export default registerRoutes;