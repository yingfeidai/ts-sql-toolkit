import { QueryParams } from "../dtos/QueryParams";

export interface IQueryValidator<FieldsEnum extends string> {
  validateSelect(params: QueryParams<FieldsEnum>): void;
}
