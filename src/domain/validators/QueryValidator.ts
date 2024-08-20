import { QueryParams } from "../dtos/QueryParams";
import { CountParams } from "../dtos/CountParams";
import { BatchInsertParams } from "../dtos/BatchInsertParams";
import { IFieldValidator } from "../interfaces/IFieldValidator";
import { IOperatorValidator } from "../interfaces/IOperatorValidator";
import { IQueryValidator } from "../interfaces/IQueryValidator";
import { validateJoinOptions, validatePagination, validateOrderByOptions, validateWhereOptions, validateData } from "./ValidationHelpers";
import { IValueValidator } from "../interfaces/IValueValidator";

export class QueryValidator<FieldsEnum extends string> implements IQueryValidator<FieldsEnum> {

  constructor(
    private fieldValidator: IFieldValidator,
    private operatorValidator: IOperatorValidator,
    private valueValidator: IValueValidator
  ) {}

  validateCount(params: CountParams<FieldsEnum>): void {
    if (params.select) {
      this.validateFields([params.select]); 
    }
    if (params.where) {
      validateWhereOptions(params.where, this.fieldValidator, this.operatorValidator, this.valueValidator); 
    }
    if (params.join) {
      validateJoinOptions(params.join, this.fieldValidator); 
    }
  }
  
  validateSelect(params: QueryParams<FieldsEnum>): void {
    if (params.select) {
      this.validateFields(params.select); 
    }
    if (params.where) {
      validateWhereOptions(params.where, this.fieldValidator, this.operatorValidator, this.valueValidator); 
    }
    if (params.pagination) {
      validatePagination(params.pagination);
    }
    if (params.join) {
      validateJoinOptions(params.join, this.fieldValidator); 
    }
    if (params.orderBy) {
      validateOrderByOptions(params.orderBy, this.fieldValidator); 
    }
    if (params.groupBy) {
      this.validateFields(params.groupBy); 
    }
  }

  validateBatchInsert(params: BatchInsertParams<FieldsEnum>): void {
    if (params.batchSize <= 0) {
      throw new Error(`Invalid batch size: ${params.batchSize}`);
    }
    validateData(params.data, this.fieldValidator, this.valueValidator); 
  }

  private validateFields(fields: FieldsEnum[]): void {
    this.fieldValidator.validateFields(fields);
  }
}
