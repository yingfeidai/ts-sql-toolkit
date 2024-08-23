import { BatchInsertParams } from '../dtos/BatchInsertParams'
import { DeleteParams } from '../dtos/DeleteParams'
import {
  BatchExecutionErrorResult,
  ExecutionResult,
} from '../dtos/ExecutionResult'
import { InsertParams } from '../dtos/InsertParams'
import { QueryParams } from '../dtos/QueryParams'
import { UpdateParams } from '../dtos/UpdateParams'
import { ISQLExecutor } from './ISQLExecutor'

export interface ISQLManager<FieldsEnum extends string> {
  select(table: string, params: QueryParams<FieldsEnum>): Promise<any>
  insert(table: string, params: InsertParams<FieldsEnum>): Promise<void>
  update(
    table: string,
    params: UpdateParams<FieldsEnum>,
  ): Promise<ExecutionResult>
  delete(
    table: string,
    params: DeleteParams<FieldsEnum>,
  ): Promise<ExecutionResult>
  batchInsert(
    table: string,
    params: BatchInsertParams<FieldsEnum>,
  ): Promise<BatchExecutionErrorResult<FieldsEnum>>
  batchInsertWithTransaction(
    table: string,
    params: BatchInsertParams<FieldsEnum>,
  ): Promise<void>
  executeTransaction(
    operations: ((executor: ISQLExecutor) => Promise<void>)[],
  ): Promise<void>
}
