import { FieldValidator } from '../../../src/domain/validators/FieldValidator'

describe('FieldValidator', () => {
  let fieldValidator: FieldValidator

  beforeEach(() => {
    fieldValidator = new FieldValidator()
  })

  it('should validate a single field', () => {
    expect(() => fieldValidator.validateField('validField')).not.toThrow()
  })

  it('should validate multiple fields', () => {
    expect(() =>
      fieldValidator.validateFields(['field1', 'field2']),
    ).not.toThrow()
  })

  it('should throw an error for invalid field', () => {
    expect(() => fieldValidator.validateField('invalidField!')).toThrow(Error)
  })

  it('should throw an error for invalid fields array', () => {
    expect(() =>
      fieldValidator.validateFields(['validField', 'invalidField!']),
    ).toThrow(Error)
  })

  it('should detect potential SQL injection risk in field name', () => {
    expect(() =>
      fieldValidator.validateField('fieldName; DROP TABLE users'),
    ).toThrow(Error)
  })
})
