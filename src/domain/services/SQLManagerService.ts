import { BatchInsertParams } from "../dtos/BatchInsertParams";
import { CountParams } from "../dtos/CountParams";
import { DeleteParams } from "../dtos/DeleteParams";
import { InsertParams } from "../dtos/InsertParams";
import { QueryParams } from "../dtos/QueryParams";
import { UpdateParams } from "../dtos/UpdateParams";
import { ISQLBuilder } from "../interfaces/ISQLBuilder";
import { ISQLExecutor } from "../interfaces/ISQLExecutor";
import { ISQLManager } from "../interfaces/ISQLManager";
import { ISQLValidator } from "../interfaces/ISQLValidator";
import {
  ExecutionResult,
  BatchExecutionErrorResult
} from "../dtos/ExecutionResult";

export class SQLManager<FieldsEnum extends string> implements ISQLManager<FieldsEnum> {
  private readonly sqlExecutor: ISQLExecutor;
  private readonly sqlBuilder: ISQLBuilder<FieldsEnum>;
  private readonly sqlValidator: ISQLValidator<FieldsEnum>;

  constructor(
    sqlExecutor: ISQLExecutor,
    sqlBuilder: ISQLBuilder<FieldsEnum>,
    sqlValidator: ISQLValidator<FieldsEnum>
  ) {
    this.sqlExecutor = sqlExecutor;
    this.sqlBuilder = sqlBuilder;
    this.sqlValidator = sqlValidator;
  }

  async select(table: string, params: QueryParams<FieldsEnum>): Promise<any[]> {
    this.sqlValidator.validateSelect(params);

    const { query, values } = this.sqlBuilder.buildSelectQuery(table, params);
    return this.sqlExecutor.queryRaw<any[]>(query, values);
  }

  async count(table: string, params: CountParams<FieldsEnum>): Promise<number> {
    this.sqlValidator.validateCount(params);

    const { query, values } = this.sqlBuilder.buildCountQuery(table, params);
    const result = await this.sqlExecutor.queryRaw<{ count: number }>(query, values);
    return result[0].count;
  }

  async insert(table: string, params: InsertParams<FieldsEnum>): Promise<void> {
    this.sqlValidator.validateInsert(params);

    const { query, values } = this.sqlBuilder.buildInsertQuery(table, params);
    await this.sqlExecutor.executeRaw(query, values);
  }

  async update(table: string, params: UpdateParams<FieldsEnum>): Promise<ExecutionResult> {
    this.sqlValidator.validateUpdate(params);

    const { query, values } = this.sqlBuilder.buildUpdateQuery(table, params);
    const affectedRows = await this.sqlExecutor.executeRaw(query, values);
    return { affectedRows };
  }

  async delete(table: string, params: DeleteParams<FieldsEnum>): Promise<ExecutionResult> {
    this.sqlValidator.validateDelete(params);

    const { query, values } = this.sqlBuilder.buildDeleteQuery(table, params);
    const affectedRows = await this.sqlExecutor.executeRaw(query, values);
    return { affectedRows };
  }

  async batchInsert(
    table: string,
    params: BatchInsertParams<FieldsEnum>
  ): Promise<BatchExecutionErrorResult<FieldsEnum>> {
    this.sqlValidator.validateInsert({ data: params.data });

    const { batchSize = 1000, data } = params;
    const errorResults: BatchExecutionErrorResult<FieldsEnum> = [];

    for (let i = 0; i < data.length; i += batchSize) {
      const batchData = data.slice(i, i + batchSize);
      try {
        const { query, values } = this.sqlBuilder.buildInsertQuery(table, { data: batchData });
        await this.sqlExecutor.executeRaw(query, values);
      } catch (error) {
        errorResults.push({
          data: batchData,
          error: error as Error,
        });
      }
    }

    return errorResults;
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
