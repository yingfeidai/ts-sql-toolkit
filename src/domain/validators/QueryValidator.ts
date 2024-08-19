import { QueryParams } from "../dtos/QueryParams";
import { IFieldValidator } from "../interfaces/IFieldValidator";
import { IOperatorValidator } from "../interfaces/IOperatorValidator";
import { ValueValidator } from "../validators/ValueValidator";

export class QueryValidator<FieldsEnum extends string> {
  private readonly fieldValidator: IFieldValidator;
  private readonly operatorValidator: IOperatorValidator;
  private readonly valueValidator: ValueValidator;

  constructor(
    fieldValidator: IFieldValidator,
    operatorValidator: IOperatorValidator,
    valueValidator: ValueValidator
  ) {
    this.fieldValidator = fieldValidator;
    this.operatorValidator = operatorValidator;
    this.valueValidator = valueValidator;
  }

  validateQuery(params: QueryParams<FieldsEnum>): void {
    if (params.select) {
      this.fieldValidator.validateFields(params.select);
    }

    if (params.where) {
      params.where.forEach(condition => {
        this.fieldValidator.validateFields([condition.field]);
        if (condition.operator !== undefined) {
          this.operatorValidator.validateOperators([condition.operator]);
        }
        this.valueValidator.validateValues([condition.value]);
      });
    }
  }
}
