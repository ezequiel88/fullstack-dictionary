import z from "zod";


const signupSchema = z.object({
    name: z.string().min(3, "Nome muito curto"),
    email: z.email("Email inválido"),
    password: z.string().min(6, "Senha inválida")
});

const signinSchema = z.object({
    email: z.email("Email inválido"),
    password: z.string().min(6, "Senha inválida")
});

export { signupSchema, signinSchema };