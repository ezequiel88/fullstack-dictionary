import { UserService } from "@/application/user.service.js";
import { signinSchema, signupSchema } from "@/infrastructure/validation/auth.js";
import { FastifyRequest, FastifyReply } from 'fastify';

export class AuthController {
    static signUp = async (request: FastifyRequest, reply: FastifyReply) => {
        const parsed = signupSchema.safeParse(request.body);

        if (!parsed.success) {
            return reply.code(400).send({ message: parsed.error.message });
        }

        const exists = await UserService.getUserByEmail(parsed.data.email);

        if (exists) {
            return reply.code(400).send({ message: "User already exists" });
        }

        const user = await UserService.createUser(parsed.data);
        const token = await reply.jwtSign({ id: user.id, email: user.email });

        return reply.code(201).send({ user, token });
    };

    static signIn = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const parsed = signinSchema.safeParse(request.body);

            if (!parsed.success) {
                return reply.code(401).send({ message: "Invalid credentials" });
            }

            const user = await UserService.getUserByEmail(parsed.data.email);

            if (!user) {
                return reply.code(401).send({ message: "Invalid credentials" });
            }

            const isValid = await UserService.validatePassword(parsed.data.password, user.password);

            if (!isValid) {
                return reply.code(401).send({ message: "Invalid credentials" });
            }

            const token = await reply.jwtSign({ id: user.id, email: user.email });

            return reply.code(200).send({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    createdAt: user.createdAt
                },
                token
            });
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ message: "Internal server error" });
        }
    };
}