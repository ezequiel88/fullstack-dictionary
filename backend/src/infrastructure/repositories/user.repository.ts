import { User } from '@prisma/client';
import { IUserRepository } from '../../domain/repositories/user.repository.interface.js';
import { UserCreate } from '../types/user.js';
import prisma from '../database/prisma.js';

export class UserRepository implements IUserRepository {
  async create(user: UserCreate): Promise<User> {
    return prisma.user.create({
      data: user
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id }
    });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id }
    });
  }
}