import { FastifyInstance } from "fastify";


const authRoutes = async (app: FastifyInstance) => {
    app.post("/signin", async (request, reply) => { });
    app.post("/signup", async (request, reply) => { });
};

export default authRoutes;