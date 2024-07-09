import { BatchInsertParams } from "../dtos/BatchInsertParams";
import { DeleteParams } from "../dtos/DeleteParams";
import {
  BatchExecutionErrorResult,
  ExecutionResult,
} from "../dtos/ExecutionResult";
import { InsertParams } from "../dtos/InsertParams";
import { QueryParams } from "../dtos/QueryParams";
import { UpdateParams } from "../dtos/UpdateParams";
import { ISQLBuilder } from "../interfaces/ISQLBuilder";
import { ISQLExecutor } from "../interfaces/ISQLExecutor";
import { ISQLManager } from "../interfaces/ISQLManager";

export class SQLManager<FieldsEnum extends string>
  implements ISQLManager<FieldsEnum>
{
  private readonly sqlExecutor: ISQLExecutor;
  private readonly sqlBuilder: ISQLBuilder<FieldsEnum>;

  constructor(sqlExecutor: ISQLExecutor, sqlBuilder: ISQLBuilder<FieldsEnum>) {
    this.sqlExecutor = sqlExecutor;
    this.sqlBuilder = sqlBuilder;
  }

  async select(
    table: string,
    params: QueryParams<FieldsEnum>
  ): Promise<any[]> {
    const query = this.sqlBuilder.buildSelectQuery(table, params);
    try {
      return await this.sqlExecutor.queryRaw<any[]>(query);
    } catch (error) {
      console.error("Error executing select query:", error);
      throw error;
    }
  }

  async insert(
    table: string,
    params: InsertParams<FieldsEnum>
  ): Promise<void> {
    const query = this.sqlBuilder.buildInsertQuery(table, params);
    try {
      await this.sqlExecutor.executeRaw(query);
    } catch (error) {
      console.error("Error executing insert query:", error);
      throw error;
    }
  }

  async update(
    table: string,
    params: UpdateParams<FieldsEnum>
  ): Promise<ExecutionResult> {
    const query = this.sqlBuilder.buildUpdateQuery(table, params);
    try {
      const affectedRows = await this.sqlExecutor.executeRaw(query);
      return { affectedRows };
    } catch (error) {
      console.error("Error executing update query:", error);
      throw error;
    }
  }

  async delete(
    table: string,
    params: DeleteParams<FieldsEnum>
  ): Promise<ExecutionResult> {
    const query = this.sqlBuilder.buildDeleteQuery(table, params);
    try {
      const affectedRows = await this.sqlExecutor.executeRaw(query);
      return { affectedRows };
    } catch (error) {
      console.error("Error executing delete query:", error);
      throw error;
    }
  }

  async batchInsert(
    table: string,
    params: BatchInsertParams<FieldsEnum>
  ): Promise<BatchExecutionErrorResult<FieldsEnum>> {
    const { data, batchSize = 1000 } = params;
    const errors: BatchExecutionErrorResult<FieldsEnum> = [];

    for (let i = 0; i < data.length; i += batchSize) {
      const batchData = data.slice(i, i + batchSize);
      try {
        await this.insert(table, { data: batchData });
      } catch (error) {
        errors.push({ data: batchData, error: error as Error });
      }
    }

    return errors;
  }

  async batchInsertWithTransaction(
    table: string,
    params: BatchInsertParams<FieldsEnum>
  ): Promise<void> {
    const { data, batchSize = 1000 } = params;
    await this.executeTransaction([
      async () => {
        for (let i = 0; i < data.length; i += batchSize) {
          const batchData = data.slice(i, i + batchSize);
          await this.insert(table, { data: batchData });
        }
      },
    ]);
  }

  async executeTransaction(
    operations: ((executor: ISQLExecutor) => Promise<void>)[]
  ): Promise<void> {
    await this.sqlExecutor.executeTransaction(operations);
  }
}
