import { InsertParams } from '../dtos/InsertParams'
import { UpdateParams } from '../dtos/UpdateParams'
import { DeleteParams } from '../dtos/DeleteParams'
import { QueryParams } from '../dtos/QueryParams'
import { CountParams } from '../dtos/CountParams'
import { IFieldValidator } from '../interfaces/IFieldValidator'
import { IQueryValidator } from '../interfaces/IQueryValidator'
import { ValueValidator } from '../validators/ValueValidator'
import { FieldValidator } from '../validators/FieldValidator'
import { TableValidator } from '../validators/TableValidator'
import { QueryValidator } from '../validators/QueryValidator'
import {
  validateData,
  validateWhereOptions,
} from '../validators/ValidationHelpers'
import { ISQLValidator } from '../interfaces/ISQLValidator'
import { IValueValidator } from '../interfaces/IValueValidator'
import { ITableValidator } from '../interfaces/ITableValidator'
import { BatchInsertParams } from '../dtos/BatchInsertParams'

export class SQLValidator<FieldsEnum extends string>
  implements ISQLValidator<FieldsEnum> {
  private readonly fieldValidator: IFieldValidator
  private readonly tableValidator: ITableValidator
  private readonly valueValidator: IValueValidator
  private readonly queryValidator: IQueryValidator<FieldsEnum>

  constructor() {
    this.tableValidator = new TableValidator()
    this.fieldValidator = new FieldValidator()
    this.valueValidator = new ValueValidator()
    this.queryValidator = new QueryValidator(
      this.fieldValidator,
      this.valueValidator,
    )
  }

  validateTableName = (tableName: string): void => {
    this.tableValidator.validateTableName(tableName)
  }

  validateSelect(params: QueryParams<FieldsEnum>): void {
    this.queryValidator.validateSelect(params)
  }

  validateCount(params: CountParams<FieldsEnum>): void {
    this.queryValidator.validateCount(params)
  }

  validateInsert(params: InsertParams<FieldsEnum>): void {
    if (
      !params.data ||
      !Array.isArray(params.data) ||
      params.data.length === 0
    ) {
      throw new Error('Invalid data for InsertParams')
    }
    validateData(params.data, this.fieldValidator, this.valueValidator)
  }

  validateUpdate(params: UpdateParams<FieldsEnum>): void {
    if (!params.data || typeof params.data !== 'object') {
      throw new Error('Invalid data for UpdateParams')
    }
    validateData([params.data], this.fieldValidator, this.valueValidator)

    if (
      !params.where ||
      !Array.isArray(params.where) ||
      params.where.length === 0
    ) {
      throw new Error('Invalid where for UpdateParams')
    }
    validateWhereOptions(params.where, this.fieldValidator, this.valueValidator)
  }

  validateDelete(params: DeleteParams<FieldsEnum>): void {
    if (
      !params.where ||
      !Array.isArray(params.where) ||
      params.where.length === 0
    ) {
      throw new Error('Invalid where for DeleteParams')
    }
    validateWhereOptions(params.where, this.fieldValidator, this.valueValidator)
  }

  validateBatchInsert(params: BatchInsertParams<FieldsEnum>): void {
    if (params.batchSize <= 0) {
      throw new Error(`Invalid batch size: ${params.batchSize}`)
    }
    validateData(params.data, this.fieldValidator, this.valueValidator)
  }
}
