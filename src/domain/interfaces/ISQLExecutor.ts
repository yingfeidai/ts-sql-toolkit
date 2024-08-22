export interface ISQLExecutor {
  queryRaw<T>(query: string, values?: any[]): Promise<T[]>;
  executeRaw(query: string, values?: any[]): Promise<number>;
  executeTransaction(
    operations: ((executor: ISQLExecutor) => Promise<void>)[]
  ): Promise<void>;
}
