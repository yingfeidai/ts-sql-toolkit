import { JoinOptionsType } from "../types/JoinOptionsType";
import { OrderByOptionsType } from "../types/OrderByOptionsType";
import { PaginationOptionsType } from "../types/PaginationOptionsType";
import { WhereOptionsType } from "../types/WhereOptionsType";
import { InsertParams } from "../dtos/InsertParams";
import { QueryParams } from "../dtos/QueryParams";
import { UpdateParams } from "../dtos/UpdateParams";
import { DeleteParams } from "../dtos/DeleteParams";
import { ISQLBuilder } from "../interfaces/ISQLBuilder";
import { joinTypes } from "../enums/JoinTypesEnum";
import { operatorTypes } from "../enums/OperatorTypesEnum";
import { orderByTypes } from "../enums/OrderByTypesEnum";
import { CountParams } from "../dtos/CountParams";
import { SQLQueryResult } from "../dtos/SQLQueryResult";
import { PartialFieldValueMapType } from "../types/PartialFieldValueMapType";

export class SQLBuilder<FieldsEnum extends string>
  implements ISQLBuilder<FieldsEnum>
{
  buildSelectQuery(
    table: string,
    params: QueryParams<FieldsEnum>
  ): SQLQueryResult {
    const baseQuery = `SELECT ${this.buildFieldsClause(
      params.select
    )} FROM ${table}`;
    return this.buildQuery(baseQuery, params);
  }

  buildCountQuery(
    table: string,
    params: CountParams<FieldsEnum>
  ): SQLQueryResult {
    const selectField = params.select ? params.select : "*";
    const baseQuery = `SELECT COUNT(${selectField}) AS count FROM ${table}`;
    return this.buildQuery(baseQuery, params);
  }

  buildInsertQuery(
    table: string,
    params: InsertParams<FieldsEnum>
  ): SQLQueryResult {
    const { fields, placeholders, values } = this.buildInsertValues(
      params.data
    );
    const query = `INSERT INTO ${table} (${fields}) VALUES ${placeholders.join(
      ", "
    )}`;
    return { query, values };
  }

  buildUpdateQuery(
    table: string,
    params: UpdateParams<FieldsEnum>
  ): SQLQueryResult {
    const setClause = this.buildSetClause(params.data);
    const whereClause = this.buildWhereClause(params.where);

    const query =
      `UPDATE ${table} SET ${setClause.query} ${whereClause.query}`.trim();
    const values = [...setClause.values, ...whereClause.values];

    return { query, values };
  }

  buildDeleteQuery(
    table: string,
    params: DeleteParams<FieldsEnum>
  ): SQLQueryResult {
    const whereClause = this.buildWhereClause(params.where);
    const query = `DELETE FROM ${table} ${whereClause.query}`.trim();
    return { query, values: whereClause.values };
  }

  private buildQuery(
    baseQuery: string,
    params: QueryParams<FieldsEnum> | CountParams<FieldsEnum>
  ): SQLQueryResult {
    const joinClause = this.buildJoinClauses(params.join);
    const whereClause = this.buildWhereClause(params.where);
    let query = `${baseQuery} ${joinClause} ${whereClause.query}`.trim();
    let values = whereClause.values;

    if (this.isQueryParams(params)) {
      const groupByClause = this.buildGroupByClause(params.groupBy);
      const orderByClause = this.buildOrderByClause(params.orderBy);
      const paginationClause = this.buildPaginationClause(params.pagination);

      query =
        `${query} ${groupByClause} ${orderByClause} ${paginationClause}`.trim();
    }

    return { query, values };
  }

  private buildFieldsClause(fields?: FieldsEnum[]): string {
    return fields?.length ? fields.join(", ") : "*";
  }

  private buildJoinClauses(joins?: JoinOptionsType[]): string {
    return this.buildClause(
      joins,
      (join) =>
        `${join.type || joinTypes.INNER} JOIN ${join.table} ON ${join.on}`
    );
  }

  private buildWhereClause(
    where?: WhereOptionsType<FieldsEnum>[]
  ): SQLQueryResult {
    if (!where || where.length === 0) {
      return { query: "", values: [] };
    }

    const conditions: string[] = [];
    const values: any[] = [];

    where.forEach((condition) => {
      const { field, operator, value } = condition;
      conditions.push(`${field} ${operator} ?`);
      values.push(value);
    });

    const query = `WHERE ${conditions.join(" AND ")}`;
    return { query, values };
  }

  private buildSetClause(
    data: PartialFieldValueMapType<FieldsEnum>
  ): SQLQueryResult {
    const fields = Object.keys(data);
    const values = Object.values(data);

    const setClauses = fields.map((field) => `${field} = ?`);
    const query = setClauses.join(", ");

    return { query, values };
  }

  private buildInsertValues(data: PartialFieldValueMapType<FieldsEnum>[]): {
    fields: string;
    placeholders: string[];
    values: any[];
  } {
    const fields = Object.keys(data[0]);
    const placeholders = data.map(
      () => `(${fields.map(() => "?").join(", ")})`
    );
    const values = data.flatMap((row) => Object.values(row));

    return { fields: fields.join(", "), placeholders, values };
  }

  private isQueryParams(
    params: QueryParams<FieldsEnum> | CountParams<FieldsEnum>
  ): params is QueryParams<FieldsEnum> {
    return (params as QueryParams<FieldsEnum>).pagination !== undefined;
  }

  private buildClause<FieldsEnum>(
    items?: FieldsEnum[],
    buildFn: (item: FieldsEnum) => string = (item: FieldsEnum) => `${item}`
  ): string {
    if (!items?.length) return "";
    return items.map(buildFn).join(", ");
  }

  private buildGroupByClause(fields?: FieldsEnum[]): string {
    return this.buildClause(fields, (field) => field);
  }

  private buildOrderByClause(
    orderBy?: OrderByOptionsType<FieldsEnum>[]
  ): string {
    return this.buildClause(
      orderBy,
      (order) => `${order.field} ${order.direction || orderByTypes.ASC}`
    );
  }

  private buildPaginationClause(pagination?: PaginationOptionsType): string {
    if (!pagination || pagination.limit === -1) return "";

    return `LIMIT ${pagination.limit || 10} OFFSET ${pagination.offset || 0}`;
  }
}
