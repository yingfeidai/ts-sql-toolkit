export interface ISQLExecutor {
  queryRaw(query: string, values?: any): Promise<any>
  executeRaw(query: string, values?: any): Promise<number>
  executeTransaction(
    operations: ((executor: ISQLExecutor) => Promise<void>)[],
  ): Promise<void>
}
