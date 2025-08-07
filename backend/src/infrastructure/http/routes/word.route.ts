import { FastifyInstance } from "fastify";


const wordRoutes = async (app: FastifyInstance) => {
    app.addHook("preValidation", app.authenticate);

    app.get("/en", async (request, reply) => { });
    app.get("/me/:wordId", async (request, reply) => { });
    app.post("/me/:wordId/favorite", async (request, reply) => { });
    app.delete("/me/:wordId/unfavorite", async (request, reply) => { });
};

export default wordRoutes;