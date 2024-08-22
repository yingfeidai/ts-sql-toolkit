import { CountParams } from "../dtos/CountParams";
import { DeleteParams } from "../dtos/DeleteParams";
import { InsertParams } from "../dtos/InsertParams";
import { QueryParams } from "../dtos/QueryParams";
import { SQLQueryResult } from "../dtos/SQLQueryResult";
import { UpdateParams } from "../dtos/UpdateParams";

export interface ISQLBuilder<FieldsEnum extends string> {
  buildSelectQuery(
    table: string,
    params: QueryParams<FieldsEnum>
  ): SQLQueryResult;
  buildCountQuery(
    table: string,
    params: CountParams<FieldsEnum>
  ): SQLQueryResult;
  buildInsertQuery(
    table: string,
    params: InsertParams<FieldsEnum>
  ): SQLQueryResult;
  buildUpdateQuery(
    table: string,
    params: UpdateParams<FieldsEnum>
  ): SQLQueryResult;
  buildDeleteQuery(
    table: string,
    params: DeleteParams<FieldsEnum>
  ): SQLQueryResult;
}
