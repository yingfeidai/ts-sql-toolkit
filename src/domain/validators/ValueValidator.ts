
// ValueValidator.ts
export class ValueValidator {
  private readonly valueRegex = /^[^'";]*$/;

  validateValue(value: any): void {
    if (!this.isValidValue(value)) {
      throw new Error(`Invalid value: ${value}`);
    }
  }

  validateValues(values: any[]): void {
    values.forEach(this.validateValue.bind(this));
  }

  private isValidValue(value: any): boolean {
    if (typeof value === "string") {
      return this.valueRegex.test(value);
    }
    if (
      typeof value === "number" ||
      typeof value === "boolean" ||
      value === null ||
      Array.isArray(value)
    ) {
      return true;
    }
    return false;
  }
}
