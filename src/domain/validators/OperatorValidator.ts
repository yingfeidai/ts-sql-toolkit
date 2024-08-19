
import { operatorTypes, OperatorTypesEnum } from "../enums/OperatorTypesEnum";
import { IOperatorValidator } from "../interfaces/IOperatorValidator";

export class OperatorValidator implements IOperatorValidator {
  validateOperator(operator: OperatorTypesEnum): void {
    if (!this.isOperatorValid(operator)) {
      throw new Error(`Invalid operator: ${operator}`);
    }
  }

  validateOperators(operators: OperatorTypesEnum[]): void {
    operators.forEach(this.validateOperator.bind(this));
  }

  private isOperatorValid(operator: OperatorTypesEnum): boolean {
    return Object.values(operatorTypes).includes(operator);
  }
}
