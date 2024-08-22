import { IFieldValidator } from "../interfaces/IFieldValidator";

export class FieldValidator implements IFieldValidator {
  private readonly nameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

  validateField(field: string): void {
    if (!this.isNameValid(field)) {
      throw new Error(`Invalid field name: ${field}`);
    }
  }

  validateFields(fields: string[]): void {
    fields.forEach(this.validateField.bind(this));
  }

  private isNameValid(name: string): boolean {
    return this.nameRegex.test(name);
  }
}
