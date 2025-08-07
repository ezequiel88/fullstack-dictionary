import { FastifyInstance } from "fastify";
import { AuthController } from "../controller/auth.controller.js";


const authRoutes = async (app: FastifyInstance) => {
    app.post("/signin", AuthController.signIn);
    app.post("/signup", AuthController.signUp);
};

export default authRoutes;