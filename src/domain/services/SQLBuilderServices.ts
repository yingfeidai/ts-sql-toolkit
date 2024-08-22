import { JoinOptionsType } from '../types/JoinOptionsType'
import { OrderByOptionsType } from '../types/OrderByOptionsType'
import { PaginationOptionsType } from '../types/PaginationOptionsType'
import { WhereOptionsType } from '../types/WhereOptionsType'
import { InsertParams } from '../dtos/InsertParams'
import { QueryParams } from '../dtos/QueryParams'
import { UpdateParams } from '../dtos/UpdateParams'
import { DeleteParams } from '../dtos/DeleteParams'
import { ISQLBuilder } from '../interfaces/ISQLBuilder'
import { joinTypes } from '../enums/JoinTypesEnum'
import { orderByTypes } from '../enums/OrderByTypesEnum'
import { CountParams } from '../dtos/CountParams'
import { SQLQueryResult } from '../dtos/SQLQueryResult'
import { PartialFieldValueMapType } from '../types/PartialFieldValueMapType'

export class SQLBuilder<FieldsEnum extends string>
  implements ISQLBuilder<FieldsEnum> {
  buildSelectQuery(
    table: string,
    params: QueryParams<FieldsEnum>,
  ): SQLQueryResult {
    const baseQuery = `SELECT ${this.buildFieldsClause(
      params.select,
    )} FROM ${table}`
    return this.buildFullSelectQuery(baseQuery, params)
  }

  buildCountQuery(
    table: string,
    params: CountParams<FieldsEnum>,
  ): SQLQueryResult {
    const selectField = params.select ? '?' : '*'
    const baseQuery = `SELECT COUNT(${selectField}) AS count FROM ${table}`
    return this.buildFullCountQuery(
      baseQuery,
      params,
      params.select ? [params.select] : [],
    )
  }

  buildInsertQuery(
    table: string,
    params: InsertParams<FieldsEnum>,
  ): SQLQueryResult {
    const { fields, placeholders, values } = this.buildInsertValues(params.data)
    return {
      query: `INSERT INTO ${table} (${fields}) VALUES ${placeholders.join(
        ', ',
      )}`,
      values,
    }
  }

  buildUpdateQuery(
    table: string,
    params: UpdateParams<FieldsEnum>,
  ): SQLQueryResult {
    const setClause = this.buildSetClause(params.data)
    const whereClause = this.buildWhereClause(params.where)
    return {
      query: `UPDATE ${table} SET ${setClause.query} ${whereClause.query}`.trim(),
      values: [...setClause.values, ...whereClause.values],
    }
  }

  buildDeleteQuery(
    table: string,
    params: DeleteParams<FieldsEnum>,
  ): SQLQueryResult {
    const whereClause = this.buildWhereClause(params.where)
    return {
      query: `DELETE FROM ${table} ${whereClause.query}`.trim(),
      values: whereClause.values,
    }
  }

  private buildFullSelectQuery(
    baseQuery: string,
    params: QueryParams<FieldsEnum>,
    additionalValues: any = [],
  ): SQLQueryResult {
    const { join, where, groupBy, orderBy, pagination } = params
    const query = [
      baseQuery,
      this.buildJoinClauses(join),
      this.buildWhereClause(where).query,
      this.buildGroupByClause(groupBy),
      this.buildOrderByClause(orderBy),
      this.buildPaginationClause(pagination),
    ]
      .filter(Boolean)
      .join(' ')
      .trim()
    const values = [...additionalValues, ...this.buildWhereClause(where).values]
    return { query, values }
  }

  private buildFullCountQuery(
    baseQuery: string,
    params: CountParams<FieldsEnum>,
    additionalValues: any = [],
  ): SQLQueryResult {
    const { join, where } = params
    const query = [
      baseQuery,
      this.buildJoinClauses(join),
      this.buildWhereClause(where).query,
    ]
      .filter(Boolean)
      .join(' ')
      .trim()
    const values = [...additionalValues, ...this.buildWhereClause(where).values]
    return { query, values }
  }

  private buildFieldsClause(fields?: FieldsEnum[]): string {
    return fields?.length ? fields.join(', ') : '*'
  }

  private buildJoinClauses(joins?: JoinOptionsType[]): string {
    return (
      joins
        ?.map(
          ({ type = joinTypes.INNER, table, on }) =>
            `${type} JOIN ${table} ON ${on}`,
        )
        .join(' ') || ''
    )
  }

  private buildWhereClause(
    where?: WhereOptionsType<FieldsEnum>[],
  ): SQLQueryResult {
    const conditions =
      where?.map(({ field, operator }) => `${field} ${operator} ?`) || []
    return {
      query: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '',
      values: where?.map((w) => w.value) || [],
    }
  }

  private buildSetClause(
    data: PartialFieldValueMapType<FieldsEnum>,
  ): SQLQueryResult {
    const fields = Object.keys(data)
    const values = Object.values(data)
    const setClauses = fields.map((field) => `${field} = ?`)
    return { query: setClauses.join(', '), values }
  }

  private buildInsertValues(
    data: PartialFieldValueMapType<FieldsEnum>[],
  ): {
    fields: string
    placeholders: string[]
    values: any
  } {
    const fields = Object.keys(data[0])
    const placeholders = data.map(() => `(${fields.map(() => '?').join(', ')})`)
    return {
      fields: fields.join(', '),
      placeholders,
      values: data.flatMap(Object.values),
    }
  }

  private buildGroupByClause(fields?: FieldsEnum[]): string {
    return fields?.length ? `GROUP BY ${fields.join(', ')}` : ''
  }

  private buildOrderByClause(
    orderBy?: OrderByOptionsType<FieldsEnum>[],
  ): string {
    return (
      orderBy
        ?.map(
          ({ field, direction = orderByTypes.ASC }) =>
            `ORDER BY ${field} ${direction}`,
        )
        .join(', ') || ''
    )
  }

  private buildPaginationClause(pagination?: PaginationOptionsType): string {
    return pagination && pagination.limit !== -1
      ? `LIMIT ${pagination.limit || 10} OFFSET ${pagination.offset || 0}`
      : ''
  }
}
