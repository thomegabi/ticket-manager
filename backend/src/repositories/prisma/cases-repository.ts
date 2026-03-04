import { Case, Company, Priority, TicketStatus, User } from '@prisma/client';
import { prisma } from '../../app'

export class CaseRepository {
  async createCase(openedByName: string, company: Company, priority: Priority, description: string, openedById?: string): Promise<Case> {
    return prisma.case.create({
      data: {
        openedByName,
        company,
        priority,
        description,
        openedById
      },
    });
  }

  async getCaseById(id: string): Promise<Case | null> {
    return prisma.case.findUnique({
      where: { id },
    });
  }

  async updateCase(id: string, data: Partial<Case>): Promise<Case> {
    return prisma.case.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date()
      }
    });
  }

  async getUserByOpenerUser(openedById: string): Promise<Case[] | null> {
    return prisma.case.findMany({
      where: { openedById },
    });
  }

  async getUserByAssignedUser(assignedToId: string): Promise<Case[] | null> {
    return prisma.case.findMany({
      where: { assignedToId },
    });
  }

  async deleteCase(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }

  async getAllCases(): Promise<Case[]> {
    return prisma.case.findMany();
  }
}
