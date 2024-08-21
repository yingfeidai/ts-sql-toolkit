import { IFieldValidator } from '../../../src/domain/interfaces/IFieldValidator'
import { IValueValidator } from '../../../src/domain/interfaces/IValueValidator'
import { JoinOptionsType } from '../../../src/domain/types/JoinOptionsType'
import { OrderByOptionsType } from '../../../src/domain/types/OrderByOptionsType'
import { PaginationOptionsType } from '../../../src/domain/types/PaginationOptionsType'
import { PartialFieldValueMapType } from '../../../src/domain/types/PartialFieldValueMapType'
import { WhereOptionsType } from '../../../src/domain/types/WhereOptionsType'
import {
  validateData,
  validateJoinOptions,
  validateOrderByOptions,
  validatePagination,
  validateWhereOptions,
} from '../../../src/domain/validators/ValidationHelpers'

describe('Validator Functions', () => {
  let mockFieldValidator: IFieldValidator
  let mockValueValidator: IValueValidator

  beforeEach(() => {
    mockFieldValidator = {
      validateField: jest.fn(),
      validateFields: jest.fn(),
    }
    mockValueValidator = {
      validateValue: jest.fn(),
      validateValues: jest.fn(),
    }
  })

  describe('validateWhereOptions', () => {
    it('should validate fields and values correctly', () => {
      const whereOptions: WhereOptionsType<string>[] = [
        { field: 'id', value: 1 },
        { field: 'name', value: 'test' },
      ]

      validateWhereOptions(whereOptions, mockFieldValidator, mockValueValidator)

      expect(mockFieldValidator.validateFields).toHaveBeenCalledWith(['id'])
      expect(mockFieldValidator.validateFields).toHaveBeenCalledWith(['name'])
      expect(mockValueValidator.validateValues).toHaveBeenCalledWith([1])
      expect(mockValueValidator.validateValues).toHaveBeenCalledWith(['test'])
    })
  })

  describe('validateJoinOptions', () => {
    it('should validate join table fields and on condition fields correctly', () => {
      const joinOptions: JoinOptionsType[] = [
        {
          table: 'users',
          on: 'users.id = orders.userId',
        },
      ]

      validateJoinOptions(joinOptions, mockFieldValidator)

      expect(mockFieldValidator.validateFields).toHaveBeenCalledWith(['users'])
      expect(mockFieldValidator.validateFields).toHaveBeenCalledWith([
        'users.id',
        'orders.userId',
      ])
    })
  })

  describe('validatePagination', () => {
    it('should throw error for invalid pagination limit', () => {
      const paginationOptions: PaginationOptionsType = { limit: 0 }

      expect(() => validatePagination(paginationOptions)).toThrow(
        'Invalid pagination limit: 0',
      )
    })

    it('should throw error for invalid pagination offset', () => {
      const paginationOptions: PaginationOptionsType = { offset: -1 }

      expect(() => validatePagination(paginationOptions)).toThrow(
        'Invalid pagination offset: -1',
      )
    })

    it('should not throw error for valid pagination options', () => {
      const paginationOptions: PaginationOptionsType = { limit: 10, offset: 0 }

      expect(() => validatePagination(paginationOptions)).not.toThrow()
    })
  })

  describe('validateOrderByOptions', () => {
    it('should validate order by fields correctly', () => {
      const orderByOptions: OrderByOptionsType<string>[] = [
        { field: 'name', direction: 'ASC' },
      ]

      validateOrderByOptions(orderByOptions, mockFieldValidator)

      expect(mockFieldValidator.validateFields).toHaveBeenCalledWith(['name'])
    })
  })

  describe('validateData', () => {
    it('should validate fields and values correctly', () => {
      const data: PartialFieldValueMapType<string>[] = [{ id: 1, name: 'test' }]

      validateData(data, mockFieldValidator, mockValueValidator)

      expect(mockFieldValidator.validateFields).toHaveBeenCalledWith(['id'])
      expect(mockFieldValidator.validateFields).toHaveBeenCalledWith(['name'])
      expect(mockValueValidator.validateValues).toHaveBeenCalledWith([1])
      expect(mockValueValidator.validateValues).toHaveBeenCalledWith(['test'])
    })
  })
})
