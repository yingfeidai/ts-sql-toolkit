export interface IOperatorValidator {
  validateOperator(operator: string): void
  validateOperators(operators: string[]): void
}
