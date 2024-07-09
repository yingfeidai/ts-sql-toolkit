export interface ISQLExecutor {
  queryRaw<T>(query: string): Promise<T[]>;
  executeRaw(query: string): Promise<number>;
  executeTransaction(operations: ((executor: ISQLExecutor) => Promise<void>)[]): Promise<void>;
}
