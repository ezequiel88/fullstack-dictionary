import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { UserCreate } from '../infrastructure/types/user.js';
import { IUserRepository } from '../domain/repositories/user.repository.interface.js';

export class UserService {
  constructor(private userRepository: IUserRepository) { }

  async createUser(user: UserCreate): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return this.userRepository.create({
      ...user,
      password: hashedPassword
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.userRepository.update(id, data);
  }

  async deleteUser(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }
}