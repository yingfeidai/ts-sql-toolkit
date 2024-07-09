import { DeleteParams } from "../dtos/DeleteParams";
import { InsertParams } from "../dtos/InsertParams";
import { QueryParams } from "../dtos/QueryParams";
import { UpdateParams } from "../dtos/UpdateParams";
import { joinTypes } from "../enums/JoinTypesEnum";
import { operatorTypes } from "../enums/OperatorTypesEnum";
import { orderByTypes } from "../enums/OrderByTypesEnum";
import { ISQLBuilder } from "../interfaces/ISQLBuilder";
import { JoinOptionsType } from "../types/JoinOptionsType";
import { OrderByOptionsType } from "../types/OrderByOptionsType";
import { PaginationOptionsType } from "../types/PaginationOptionsType";
import { WhereOptionsType } from "../types/WhereOptionsType";

export class SQLBuilder<FieldsEnum extends string>
  implements ISQLBuilder<FieldsEnum>
{
  buildSelectQuery(table: string, params: QueryParams<FieldsEnum>): string {
    let query = `SELECT ${this.buildSelectFields(params.select)} FROM ${table}`;

    if (params.join?.length) {
      query += this.buildJoinClauses(params.join);
    }

    if (params.where?.length) {
      query += this.buildWhereClause(params.where);
    }

    if (params.groupBy?.length) {
      query += this.buildGroupByClause(params.groupBy);
    }

    if (params.orderBy?.length) {
      query += this.buildOrderByClause(params.orderBy);
    }

    if (params.pagination) {
      query += this.buildPaginationClause(params.pagination);
    }

    return query;
  }

  buildInsertQuery(table: string, params: InsertParams<FieldsEnum>): string {
    const fields = Object.keys(params.data[0]).join(", ");
    const values = params.data.map(
      (row) =>
        `(${Object.values(row)
          .map((value) => `'${value}'`)
          .join(", ")})`
    );

    return `INSERT INTO ${table} (${fields}) VALUES ${values.join(", ")}`;
  }

  buildUpdateQuery(table: string, params: UpdateParams<FieldsEnum>): string {
    const setClause = Object.entries(params.data)
      .map(([field, value]) => `${field} = '${value}'`)
      .join(", ");

    const whereClause = this.buildWhereClause(params.where);

    return `UPDATE ${table} SET ${setClause} ${whereClause}`;
  }

  buildDeleteQuery(table: string, params: DeleteParams<FieldsEnum>): string {
    const whereClause = this.buildWhereClause(params.where);

    return `DELETE FROM ${table} ${whereClause}`;
  }

  private buildSelectFields(fields?: FieldsEnum[]): string {
    return fields?.length ? fields.join(", ") : "*";
  }

  private buildJoinClauses(joins: JoinOptionsType[]): string {
    return joins
      .map(
        (join) =>
          `${join.type || joinTypes.INNER} JOIN ${join.table} ON ${join.on}`
      )
      .join(" ");
  }

  private buildWhereClause(where: WhereOptionsType<FieldsEnum>[]): string {
    return `WHERE ${where
      .map(
        (condition) =>
          `${condition.field} ${condition.operator || operatorTypes.EQUALS} '${
            condition.value
          }'`
      )
      .join(" AND ")}`;
  }

  private buildGroupByClause(fields: FieldsEnum[]): string {
    return `GROUP BY ${fields.join(", ")}`;
  }

  private buildOrderByClause(
    orderBy: OrderByOptionsType<FieldsEnum>[]
  ): string {
    return `ORDER BY ${orderBy
      .map((order) => `${order.field} ${order.direction || orderByTypes.ASC}`)
      .join(", ")}`;
  }

  private buildPaginationClause(pagination: PaginationOptionsType): string {
    return `LIMIT ${pagination.limit || 10} OFFSET ${pagination.offset || 0}`;
  }
}
