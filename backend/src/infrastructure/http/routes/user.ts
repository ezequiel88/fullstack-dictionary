import { FastifyInstance } from "fastify";


const userRoutes = async (app: FastifyInstance) => {
    app.addHook("preValidation", app.authenticate);

    app.get("/me", async (request, reply) => { });
    app.get("/me/history", async (request, reply) => { });
    app.get("/me/favorites", async (request, reply) => { });
};

export default userRoutes;