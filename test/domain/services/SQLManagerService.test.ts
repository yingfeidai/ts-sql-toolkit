import { BatchInsertParams } from '../../../src/domain/dtos/BatchInsertParams'
import { DeleteParams } from '../../../src/domain/dtos/DeleteParams'
import { InsertParams } from '../../../src/domain/dtos/InsertParams'
import { QueryParams } from '../../../src/domain/dtos/QueryParams'
import { SQLQueryResult } from '../../../src/domain/dtos/SQLQueryResult'
import { UpdateParams } from '../../../src/domain/dtos/UpdateParams'
import { operatorTypes } from '../../../src/domain/enums/OperatorTypesEnum'
import { ISQLBuilder } from '../../../src/domain/interfaces/ISQLBuilder'
import { ISQLExecutor } from '../../../src/domain/interfaces/ISQLExecutor'
import { ISQLValidator } from '../../../src/domain/interfaces/ISQLValidator'
import { SQLManager } from '../../../src/domain/services/SQLManagerService'

enum Fields {
  ID = 'id',
  NAME = 'name',
  AGE = 'age',
}

describe('SQLManager', () => {
  let sqlManager: SQLManager<Fields>
  let mockSqlExecutor: jest.Mocked<ISQLExecutor>
  let mockSqlBuilder: jest.Mocked<ISQLBuilder<Fields>>
  let mockSqlValidator: jest.Mocked<ISQLValidator<Fields>>

  beforeEach(() => {
    mockSqlExecutor = {
      queryRaw: jest.fn(),
      executeRaw: jest.fn(),
      executeTransaction: jest.fn(),
    }

    mockSqlBuilder = {
      buildSelectQuery: jest.fn(),
      buildCountQuery: jest.fn(),
      buildInsertQuery: jest.fn(),
      buildUpdateQuery: jest.fn(),
      buildDeleteQuery: jest.fn(),
    }

    mockSqlValidator = {
      validateSelect: jest.fn(),
      validateCount: jest.fn(),
      validateInsert: jest.fn(),
      validateUpdate: jest.fn(),
      validateDelete: jest.fn(),
    }

    sqlManager = new SQLManager(
      mockSqlExecutor,
      mockSqlBuilder,
      mockSqlValidator,
    )
  })

  it('should execute select query', async () => {
    const table = 'testTable'
    const params: QueryParams<Fields> = {
      where: [{ field: Fields.ID, value: 1 }],
    }
    const queryResult: SQLQueryResult = {
      query: 'SELECT * FROM testTable WHERE id = 1',
      values: [],
    }
    const result = [{ id: 1, name: 'test' }]

    mockSqlBuilder.buildSelectQuery.mockReturnValue(queryResult)
    mockSqlExecutor.queryRaw.mockResolvedValue(result)

    const data = await sqlManager.select(table, params)

    expect(mockSqlBuilder.buildSelectQuery).toHaveBeenCalledWith(table, params)
    expect(mockSqlExecutor.queryRaw).toHaveBeenCalledWith(
      queryResult.query,
      queryResult.values,
    )
    expect(data).toEqual(result)
  })

  it('should execute insert query', async () => {
    const table = 'testTable'
    const params: InsertParams<Fields> = { data: [{ id: 1, name: 'test' }] }
    const queryResult: SQLQueryResult = {
      query: 'INSERT INTO testTable (id, name) VALUES (1, "test")',
      values: [],
    }

    mockSqlBuilder.buildInsertQuery.mockReturnValue(queryResult)

    await sqlManager.insert(table, params)

    expect(mockSqlBuilder.buildInsertQuery).toHaveBeenCalledWith(table, params)
    expect(mockSqlExecutor.executeRaw).toHaveBeenCalledWith(
      queryResult.query,
      queryResult.values,
    )
  })

  it('should execute update query', async () => {
    const table = 'testTable'
    const params: UpdateParams<Fields> = {
      data: { name: 'newName' },
      where: [{ field: Fields.ID, value: 1 }],
    }
    const queryResult: SQLQueryResult = {
      query: 'UPDATE testTable SET name = "newName" WHERE id = 1',
      values: [],
    }
    const affectedRows = 1

    mockSqlBuilder.buildUpdateQuery.mockReturnValue(queryResult)
    mockSqlExecutor.executeRaw.mockResolvedValue(affectedRows)

    const result = await sqlManager.update(table, params)

    expect(mockSqlBuilder.buildUpdateQuery).toHaveBeenCalledWith(table, params)
    expect(mockSqlExecutor.executeRaw).toHaveBeenCalledWith(
      queryResult.query,
      queryResult.values,
    )
    expect(result).toEqual({ affectedRows })
  })

  it('should execute delete query', async () => {
    const table = 'testTable'
    const params: DeleteParams<Fields> = {
      where: [{ field: Fields.ID, value: 1 }],
    }
    const queryResult: SQLQueryResult = {
      query: 'DELETE FROM testTable WHERE id = 1',
      values: [],
    }
    const affectedRows = 1

    mockSqlBuilder.buildDeleteQuery.mockReturnValue(queryResult)
    mockSqlExecutor.executeRaw.mockResolvedValue(affectedRows)

    const result = await sqlManager.delete(table, params)

    expect(mockSqlBuilder.buildDeleteQuery).toHaveBeenCalledWith(table, params)
    expect(mockSqlExecutor.executeRaw).toHaveBeenCalledWith(
      queryResult.query,
      queryResult.values,
    )
    expect(result).toEqual({ affectedRows })
  })

  it('should execute batch insert with transaction', async () => {
    const table = 'testTable'
    const params: BatchInsertParams<Fields> = {
      data: [
        { id: 1, name: 'test' },
        { id: 2, name: 'test2' },
      ],
      batchSize: 1,
    }

    await sqlManager.batchInsertWithTransaction(table, params)

    expect(mockSqlExecutor.executeTransaction).toHaveBeenCalledWith(
      expect.any(Array),
    )
  })

  it('should execute batch insert with errors', async () => {
    const table = 'testTable'
    const params: BatchInsertParams<Fields> = {
      data: [
        { id: 1, name: 'test' },
        { id: 2, name: 'test2' },
      ],
      batchSize: 1,
    }
    const error = new Error('Insert error')

    mockSqlExecutor.executeRaw.mockRejectedValueOnce(error)

    const errors = await sqlManager.batchInsert(table, params)

    expect(errors).toHaveLength(1)
    expect(errors[0].data).toEqual([{ id: 1, name: 'test' }])
    expect(errors[0].error).toEqual(error)
  })

  it('should execute transaction', async () => {
    const operations: ((executor: ISQLExecutor) => Promise<void>)[] = [
      async (executor) => {
        const queryResult: SQLQueryResult = {
          query: 'INSERT INTO testTable (id, name) VALUES (1, "test")',
          values: [],
        }
        await executor.executeRaw(queryResult.query, queryResult.values)
      },
    ]

    await sqlManager.executeTransaction(operations)

    expect(mockSqlExecutor.executeTransaction).toHaveBeenCalledWith(operations)
  })

  it('should execute a batch UPDATE query in a transaction', async () => {
    const table = 'testTable'
    const params: UpdateParams<Fields>[] = [
      {
        data: { name: 'Alice' },
        where: [{ field: Fields.ID, operator: operatorTypes.EQUALS, value: 1 }],
      },
      {
        data: { name: 'Bob' },
        where: [{ field: Fields.ID, operator: operatorTypes.EQUALS, value: 2 }],
      },
    ]

    const operations: ((
      executor: ISQLExecutor,
    ) => Promise<void>)[] = params.map((param) => async (executor) => {
      const queryResult: SQLQueryResult = mockSqlBuilder.buildUpdateQuery(
        table,
        param,
      )
      await executor.executeRaw(queryResult.query, queryResult.values)
    })

    await sqlManager.executeTransaction(operations)

    expect(mockSqlExecutor.executeTransaction).toHaveBeenCalledWith(operations)
  })

  it('should execute a batch DELETE query in a transaction', async () => {
    const table = 'testTable'
    const params: DeleteParams<Fields>[] = [
      {
        where: [{ field: Fields.ID, operator: operatorTypes.EQUALS, value: 1 }],
      },
      {
        where: [{ field: Fields.ID, operator: operatorTypes.EQUALS, value: 2 }],
      },
      {
        where: [{ field: Fields.ID, operator: operatorTypes.EQUALS, value: 3 }],
      },
    ]

    const operations: ((
      executor: ISQLExecutor,
    ) => Promise<void>)[] = params.map((param) => async (executor) => {
      const queryResult: SQLQueryResult = mockSqlBuilder.buildDeleteQuery(
        table,
        param,
      )
      await executor.executeRaw(queryResult.query, queryResult.values)
    })

    await sqlManager.executeTransaction(operations)

    expect(mockSqlExecutor.executeTransaction).toHaveBeenCalledWith(operations)
  })

  it('should handle errors during a transaction', async () => {
    const operations: ((executor: ISQLExecutor) => Promise<void>)[] = [
      async (executor) => {
        const queryResult: SQLQueryResult = {
          query: 'INSERT INTO testTable (id, name) VALUES (1, "test")',
          values: [],
        }
        await executor.executeRaw(queryResult.query, queryResult.values)
      },
      async () => {
        throw new Error('Transaction error')
      },
    ]

    mockSqlExecutor.executeTransaction.mockImplementation(async (ops) => {
      for (const op of ops) {
        await op(mockSqlExecutor)
      }
    })

    await expect(sqlManager.executeTransaction(operations)).rejects.toThrow(
      'Transaction error',
    )
    expect(mockSqlExecutor.executeTransaction).toHaveBeenCalledWith(operations)
  })

  it('should rollback a transaction on error', async () => {
    const operations: ((executor: ISQLExecutor) => Promise<void>)[] = [
      async (executor) => {
        const queryResult: SQLQueryResult = {
          query: 'INSERT INTO testTable (id, name) VALUES (1, "test")',
          values: [],
        }
        await executor.executeRaw(queryResult.query, queryResult.values)
      },
      async () => {
        throw new Error('Rollback error')
      },
    ]

    mockSqlExecutor.executeTransaction.mockImplementation(async (ops) => {
      try {
        for (const op of ops) {
          await op(mockSqlExecutor)
        }
      } catch (error) {
        await mockSqlExecutor.executeRaw('ROLLBACK', [])
        throw error
      }
    })

    await expect(sqlManager.executeTransaction(operations)).rejects.toThrow(
      'Rollback error',
    )
    expect(mockSqlExecutor.executeTransaction).toHaveBeenCalledWith(operations)
    expect(mockSqlExecutor.executeRaw).toHaveBeenCalledWith('ROLLBACK', [])
  })
})
