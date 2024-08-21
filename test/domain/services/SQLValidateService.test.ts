import { BatchInsertParams } from '../../../src/domain/dtos/BatchInsertParams'
import { CountParams } from '../../../src/domain/dtos/CountParams'
import { DeleteParams } from '../../../src/domain/dtos/DeleteParams'
import { InsertParams } from '../../../src/domain/dtos/InsertParams'
import { QueryParams } from '../../../src/domain/dtos/QueryParams'
import { UpdateParams } from '../../../src/domain/dtos/UpdateParams'
import { SQLValidator } from '../../../src/domain/services/SQLValidatorService'

enum Fields {
  ID = 'id',
  NAME = 'name',
  AGE = 'age',
}

describe('SQLValidator', () => {
  let sqlValidator: SQLValidator<Fields>

  beforeEach(() => {
    sqlValidator = new SQLValidator<Fields>()
  })

  describe('validateTableName', () => {
    it('should validate a valid table name', () => {
      expect(() => sqlValidator.validateTableName('users')).not.toThrow()
    })

    it('should throw an error for an invalid table name', () => {
      expect(() => sqlValidator.validateTableName('')).toThrowError()
    })
  })

  describe('validateSelect', () => {
    it('should validate select query parameters', () => {
      const params: QueryParams<Fields> = {
        select: [Fields.ID, Fields.NAME],
        where: [{ field: Fields.AGE, value: 30 }],
        orderBy: [{ field: Fields.NAME, direction: 'ASC' }],
      }

      expect(() => sqlValidator.validateSelect(params)).not.toThrow()
    })
  })

  describe('validateCount', () => {
    it('should validate count query parameters', () => {
      const params: CountParams<Fields> = {
        select: Fields.ID,
        where: [{ field: Fields.AGE, value: 30 }],
      }

      expect(() => sqlValidator.validateCount(params)).not.toThrow()
    })
  })

  describe('validateInsert', () => {
    it('should validate insert query parameters', () => {
      const params: InsertParams<Fields> = {
        data: [{ id: '1', name: 'John', age: 25 }],
      }

      expect(() => sqlValidator.validateInsert(params)).not.toThrow()
    })

    it('should throw an error for invalid data in insert parameters', () => {
      const params: InsertParams<Fields> = {
        data: [],
      }

      expect(() => sqlValidator.validateInsert(params)).toThrowError(
        'Invalid data for InsertParams',
      )
    })
  })

  describe('validateUpdate', () => {
    it('should validate update query parameters', () => {
      const params: UpdateParams<Fields> = {
        data: { name: 'John' },
        where: [{ field: Fields.ID, value: '1' }],
      }

      expect(() => sqlValidator.validateUpdate(params)).not.toThrow()
    })

    it('should throw an error for invalid data in update parameters', () => {
      const params: UpdateParams<Fields> = {
        data: {} as any,
        where: [{ field: Fields.ID, value: '1' }],
      }

      expect(() => sqlValidator.validateUpdate(params)).toThrowError(
        'Invalid data for UpdateParams',
      )
    })

    it('should throw an error for missing where conditions in update parameters', () => {
      const params: UpdateParams<Fields> = {
        data: { name: 'John' },
        where: [],
      }

      expect(() => sqlValidator.validateUpdate(params)).toThrowError(
        'Invalid where for UpdateParams',
      )
    })
  })

  describe('validateDelete', () => {
    it('should validate delete query parameters', () => {
      const params: DeleteParams<Fields> = {
        where: [{ field: Fields.ID, value: '1' }],
      }

      expect(() => sqlValidator.validateDelete(params)).not.toThrow()
    })

    it('should throw an error for missing where conditions in delete parameters', () => {
      const params: DeleteParams<Fields> = {
        where: [],
      }

      expect(() => sqlValidator.validateDelete(params)).toThrowError(
        'Invalid where for DeleteParams',
      )
    })
  })

  describe('validateBatchInsert', () => {
    it('should validate batch insert query parameters', () => {
      const params: BatchInsertParams<Fields> = {
        batchSize: 5,
        data: [{ id: '1', name: 'John', age: 25 }],
      }

      expect(() => sqlValidator.validateBatchInsert(params)).not.toThrow()
    })

    it('should throw an error for invalid batch size in batch insert parameters', () => {
      const params: BatchInsertParams<Fields> = {
        batchSize: 0,
        data: [{ id: '1', name: 'John', age: 25 }],
      }

      expect(() => sqlValidator.validateBatchInsert(params)).toThrowError(
        'Invalid batch size: 0',
      )
    })
  })
})
