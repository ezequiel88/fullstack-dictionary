import bcrypt from "bcryptjs";
import { UserCreate } from "@/infrastructure/types/user.js";
import prisma from "@/infrastructure/database/prisma.js";

export class UserService {
    static async createUser(user: UserCreate) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return prisma.user.create(
            {
                data: {
                    ...user,
                    password: hashedPassword
                }
            });
    }

    static async getUserByEmail(email: string) {
        return prisma.user.findUnique({
            where: {
                email
            }
        });
    }

    static async validatePassword(password: string, hashedPassword: string) {
        return bcrypt.compare(password, hashedPassword);
    }
}