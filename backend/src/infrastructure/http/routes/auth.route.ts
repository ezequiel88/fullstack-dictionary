import { FastifyInstance } from "fastify";
import { AuthController } from "@/infrastructure/http/controller/auth.controller.js";
import { signinSchema, signupSchema } from "@/infrastructure/swagger/definitions/auth.js";


const authRoutes = async (app: FastifyInstance) => {
    app.post("/signin", {schema : signinSchema}, AuthController.signIn);
    app.post("/signup", { schema: signupSchema }, AuthController.signUp);
};

export default authRoutes;