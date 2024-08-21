import { TableValidator } from '../../../src/domain/validators/TableValidator'

describe('TableValidator', () => {
  let tableValidator: TableValidator

  beforeEach(() => {
    tableValidator = new TableValidator()
  })

  it('should validate a valid table name', () => {
    expect(() => tableValidator.validateTableName('valid_table')).not.toThrow()
  })

  it('should throw an error for invalid table name', () => {
    expect(() => tableValidator.validateTableName('invalid-table!')).toThrow(
      Error,
    )
  })

  it('should detect potential SQL injection risk in table name', () => {
    expect(() =>
      tableValidator.validateTableName('users; DROP TABLE users'),
    ).toThrow(Error)
  })
})
