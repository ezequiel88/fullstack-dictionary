import { FastifyInstance } from "fastify";
import userRoutes from "@/infrastructure/http/routes/user.js";
import authRoutes from "@/infrastructure/http/routes/auth.js";

const registerRoutes = async (app: FastifyInstance) => {

    app.get("/", () => ({
        message: "Fullstack Challenge 🏅 - Dictionary"
    }));

    app.register(userRoutes, { prefix: "/user" });
    app.register(authRoutes, { prefix: "/auth" });

    app.setErrorHandler((error, request, reply) => {
        request.log.error(error);
        reply.status(500).send({ error: error.message });
    });
};

export default registerRoutes;