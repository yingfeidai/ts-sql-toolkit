import { QueryParams } from '../dtos/QueryParams'
import { CountParams } from '../dtos/CountParams'
import { BatchInsertParams } from '../dtos/BatchInsertParams'
import { IFieldValidator } from '../interfaces/IFieldValidator'
import { IQueryValidator } from '../interfaces/IQueryValidator'
import {
  validateJoinOptions,
  validatePagination,
  validateOrderByOptions,
  validateWhereOptions,
  validateData,
} from './ValidationHelpers'
import { IValueValidator } from '../interfaces/IValueValidator'

export class QueryValidator<FieldsEnum extends string>
  implements IQueryValidator<FieldsEnum> {
  constructor(
    private fieldValidator: IFieldValidator,
    private valueValidator: IValueValidator,
  ) {}

  validateCount(params: CountParams<FieldsEnum>): void {
    if (params.select) {
      this.validateFields([params.select])
    }
    if (params.where) {
      validateWhereOptions(
        params.where,
        this.fieldValidator,
        this.valueValidator,
      )
    }
    if (params.join) {
      validateJoinOptions(params.join, this.fieldValidator)
    }
  }

  validateSelect(params: QueryParams<FieldsEnum>): void {
    if (params.select) {
      this.validateFields(params.select)
    }
    if (params.where) {
      validateWhereOptions(
        params.where,
        this.fieldValidator,
        this.valueValidator,
      )
    }
    if (params.pagination) {
      validatePagination(params.pagination)
    }
    if (params.join) {
      validateJoinOptions(params.join, this.fieldValidator)
    }
    if (params.orderBy) {
      validateOrderByOptions(params.orderBy, this.fieldValidator)
    }
    if (params.groupBy) {
      this.validateFields(params.groupBy)
    }
  }

  private validateFields(fields: FieldsEnum[]): void {
    this.fieldValidator.validateFields(fields)
  }
}
