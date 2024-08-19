export interface IFieldValidator {
  validateField(field: string): void;
  validateFields(fields: string[]): void;
}
