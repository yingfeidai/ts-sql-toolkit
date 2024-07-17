import { CountParams } from "../dtos/CountParams";
import { DeleteParams } from "../dtos/DeleteParams";
import { InsertParams } from "../dtos/InsertParams";
import { QueryParams } from "../dtos/QueryParams";
import { UpdateParams } from "../dtos/UpdateParams";

export interface ISQLBuilder<FieldsEnum extends string> {
  buildSelectQuery(table: string, params: QueryParams<FieldsEnum>): string;
  buildCountQuery(table: string, params: CountParams<FieldsEnum>): string;
  buildInsertQuery(table: string, params: InsertParams<FieldsEnum>): string;
  buildUpdateQuery(table: string, params: UpdateParams<FieldsEnum>): string;
  buildDeleteQuery(table: string, params: DeleteParams<FieldsEnum>): string;
}
