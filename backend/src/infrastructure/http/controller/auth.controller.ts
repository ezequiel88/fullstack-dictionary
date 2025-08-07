import { UserService } from "@/application/user.service.js";
import { signinSchema, signupSchema } from "@/infrastructure/validation/auth.js";
import { FastifyReply, FastifyRequest } from "fastify";

export class AuthController {
    static signUp = async (request: FastifyRequest, reply: FastifyReply) => {
        const parsed = signupSchema.safeParse(request.body);

        if (!parsed.success) {
            return reply.status(400).send({ error: parsed.error.message });
        }

        const exists = await UserService.getUserByEmail(parsed.data.email);

        if (exists) {
            return reply.status(400).send({ error: "User already exists" });
        }

        const user = await UserService.createUser(parsed.data);
        const token = await reply.jwtSign({ id: user.id, email: user.email });

        return reply.status(201).send({ user, token });
    };

    static signIn = async (request: FastifyRequest, reply: FastifyReply) => {
         const parsed = signinSchema.safeParse(request.body);

        if (!parsed.success) {
            return reply.status(401).send({ error: "Invalid credentials" });
        }

        const user = await UserService.getUserByEmail(parsed.data.email);

        if (!user) {
            return reply.status(401).send({ error: "Invalid credentials" });
        }

        const isValid = await UserService.validatePassword(parsed.data.password, user.password);

        if (!isValid) {
            return reply.status(401).send({ error: "Invalid credentials" });
        }

        const token = await reply.jwtSign({ id: user.id, email: user.email });

        return reply.status(200).send({ user, token });
     };
}