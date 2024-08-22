
import { commandTypes, CommandTypesEnum } from "../enums/CommandTypesEnum";
import { ITableValidator } from "../interfaces/ITableValidator";

export class TableValidator implements ITableValidator {
  private readonly nameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  private readonly reservedKeywords = Object.values(commandTypes);

  validateTableName(tableName: string): void {
    if (
      !this.isNameValid(tableName) ||
      this.reservedKeywords.includes(
        tableName.toUpperCase() as CommandTypesEnum
      )
    ) {
      throw new Error(`Invalid or reserved table name: ${tableName}`);
    }
  }

  private isNameValid(name: string): boolean {
    return this.nameRegex.test(name);
  }
}
