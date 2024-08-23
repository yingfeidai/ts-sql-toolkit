import { PrismaClient } from '@prisma/client'
import { ISQLExecutor } from '../../domain/interfaces/ISQLExecutor'

export class PrismaSQLExecutor implements ISQLExecutor {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async queryRaw(query: string, values?: any): Promise<any> {
    return this.prisma.$queryRaw(query, ...(values ?? []))
  }

  async executeRaw(query: string, values?: any): Promise<number> {
    return this.prisma.$executeRaw(query, ...(values ?? []))
  }

  async executeTransaction(
    operations: ((executor: ISQLExecutor) => Promise<void>)[],
  ): Promise<void> {
    await this.prisma.$transaction(async () => {
      const tempExecutor: ISQLExecutor = this
      for (const operation of operations) {
        await operation(tempExecutor)
      }
    })
  }
}
