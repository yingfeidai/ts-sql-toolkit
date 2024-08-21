import { ValueValidator } from '../../../src/domain/validators/ValueValidator'

describe('ValueValidator', () => {
  let valueValidator: ValueValidator

  beforeEach(() => {
    valueValidator = new ValueValidator()
  })

  it('should validate a single value', () => {
    expect(() => valueValidator.validateValue('validValue')).not.toThrow()
  })

  it('should validate multiple values', () => {
    expect(() =>
      valueValidator.validateValues(['value1', 'value2']),
    ).not.toThrow()
  })

  it('should throw an error for invalid value', () => {
    expect(() => valueValidator.validateValue(null)).toThrow(Error)
  })

  it('should throw an error for invalid values array', () => {
    expect(() => valueValidator.validateValues(['value1', null])).toThrow(Error)
  })

  it('should detect potential SQL injection risk in value', () => {
    expect(() =>
      valueValidator.validateValue("value1'; DROP TABLE users; --"),
    ).toThrow(Error)
  })
})
