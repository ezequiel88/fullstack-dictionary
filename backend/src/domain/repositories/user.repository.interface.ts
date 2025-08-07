import { User } from '@prisma/client';
import { UserCreate } from '../../infrastructure/types/user.js';

export interface IUserRepository {
  create(user: UserCreate): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}