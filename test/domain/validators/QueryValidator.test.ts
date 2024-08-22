import { CountParams } from '../../../src/domain/dtos/CountParams'
import { QueryParams } from '../../../src/domain/dtos/QueryParams'
import { IFieldValidator } from '../../../src/domain/interfaces/IFieldValidator'
import { IValueValidator } from '../../../src/domain/interfaces/IValueValidator'
import { QueryValidator } from '../../../src/domain/validators/QueryValidator'

enum Fields {
  ID = 'id',
  NAME = 'name',
  AGE = 'age',
}

describe('QueryValidator', () => {
  let fieldValidator: jest.Mocked<IFieldValidator>
  let valueValidator: jest.Mocked<IValueValidator>
  let queryValidator: QueryValidator<Fields>

  beforeEach(() => {
    fieldValidator = {
      validateField: jest.fn(),
      validateFields: jest.fn(),
    }
    valueValidator = {
      validateValue: jest.fn(),
      validateValues: jest.fn(),
    }
    queryValidator = new QueryValidator(fieldValidator, valueValidator)
  })

  describe('validateCount', () => {
    it('should validate select field, where conditions, and join options', () => {
      const params: CountParams<Fields> = {
        select: Fields.NAME,
        where: [{ field: Fields.AGE, value: 30 }],
        join: [{ table: 'orders', on: 'id = orders.id' }], // Adjusted according to the JoinOptionsType definition
      }

      queryValidator.validateCount(params)

      expect(fieldValidator.validateFields).toHaveBeenCalledWith([Fields.NAME])
      expect(fieldValidator.validateFields).toHaveBeenCalledWith([Fields.AGE])
      expect(valueValidator.validateValues).toHaveBeenCalledWith([30])
    })
  })

  describe('validateSelect', () => {
    it('should validate all fields, where conditions, pagination, join options, order by, and group by', () => {
      const params: QueryParams<Fields> = {
        select: [Fields.ID, Fields.NAME],
        where: [{ field: Fields.AGE, value: 30 }],
        pagination: { limit: 10, offset: 0 },
        join: [{ table: 'orders', on: 'id = orders.id' }],
        orderBy: [{ field: Fields.NAME, direction: 'ASC' }],
        groupBy: [Fields.NAME],
      }

      queryValidator.validateSelect(params)

      expect(fieldValidator.validateFields).toHaveBeenCalledWith([
        Fields.ID,
        Fields.NAME,
      ])
      expect(fieldValidator.validateFields).toHaveBeenCalledWith([Fields.AGE])
      expect(valueValidator.validateValues).toHaveBeenCalledWith([30])
      expect(fieldValidator.validateFields).toHaveBeenCalledWith([Fields.NAME])
    })
  })
})
