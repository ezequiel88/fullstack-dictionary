import { FastifyInstance } from "fastify";
import { AuthController } from "../controller/auth.controller.js";
import { signinSchema, signupSchema } from "../../swagger/definitions/auth.js";


const authRoutes = async (app: FastifyInstance) => {
    app.post("/signin", { 
        schema: {
            ...signinSchema,
            body: undefined // Remove Swagger body validation to use Zod in controller
        }
    }, AuthController.signIn);
    app.post("/signup", { 
        schema: {
            ...signupSchema,
            body: undefined // Remove Swagger body validation to use Zod in controller
        }
    }, AuthController.signUp);
};

export default authRoutes;