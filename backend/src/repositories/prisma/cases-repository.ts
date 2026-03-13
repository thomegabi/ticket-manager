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

  async deleteCase(id: string): Promise<Case> {
    return prisma.case.delete({
      where: { id },
    });
  }

  async getAllCases(): Promise<Case[]> {
    return prisma.case.findMany();
  }

async getDurationReport(userId: string, startDate?: Date, endDate?: Date) {

  if (startDate) startDate.setHours(0,0,0,0)
  if (endDate) endDate.setHours(23,59,59,999)

  const tickets = await prisma.case.findMany({
    where: {
      assignedToId: userId,
      status: "CLOSED",
      created_at: {
        gte: startDate,
        lte: endDate
      }
    },
    select: {
      created_at: true,
      duration: true
    }
  })

  const totalTickets = tickets.length

  const totalDuration = tickets.reduce((sum, ticket) => {
    return sum + (ticket.duration ?? 0)
  }, 0)

  const averageDuration =
    totalTickets > 0
      ? Math.round(totalDuration / totalTickets)
      : 0

  const ticketsPerDay: Record<string, number> = {}

  tickets.forEach(ticket => {

    const date = ticket.created_at
      .toISOString()
      .split("T")[0]

    ticketsPerDay[date] = (ticketsPerDay[date] || 0) + 1

  })

  const chartData = Object.entries(ticketsPerDay).map(([date, count]) => ({
    date,
    tickets: count
  }))

  return {
    totalTickets,
    totalDuration,
    averageDuration,
    chartData
  }
}
}
