import { User } from '@prisma/client';
import { prisma } from '../../app'

export class UserRepository {
  async createUser(name: string, password: string): Promise<User> {
    return prisma.user.create({
      data: {
        name,
        password,
      },
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }

  async getUserByName(name: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { name },
    });
  }

  async deleteUser(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }

  async getAllUsers(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async getAllNonAdminUsers(): Promise<User[]>{
    return prisma.user.findMany({
      where: {
        isAdmin: false
      }
    })
  }
}
