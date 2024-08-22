export interface IValueValidator {
  validateValue(value: any): void
  validateValues(values: any): void
}
