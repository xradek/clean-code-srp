// noinspection JSUnusedGlobalSymbols

const Decimal = require("decimal.js");
const ValidationResult = require("./validation-result");

/**
 * Matcher validates that string value represents a decimal number or null.
 * Decimal separator is always "."
 * In addition, it must comply to the rules described below.
 *
 * @param params - Matcher can take 0 to 2 parameters with following rules:
 * - no parameters: validates that number of digits does not exceed the maximum value of 11.
 * - one parameter: the parameter specifies maximum length of number for the above rule (parameter replaces the default value of 11)
 * - two parameters:
 *   -- first parameter represents the total maximum number of digits,
 *   -- the second parameter represents the maximum number of decimal places.
 *   -- both conditions must be met in this case.
 */
class DecimalNumberMatcher {
  constructor(...params) {
    this.params = params;
  }

  /**
   * Checks if the send string value is vaid number with the valid number of digits and valid number of decimal digits
   * @param {String} - Value to be validated as a number
   * @returns {ValidationResult} - Matcher returns validationResult object with the result of the validation
   */
  match(valueToValidate) {
    let resultOfValidation = new ValidationResult();
    const DefaultNumberOfDigits = 11;
    const MaxNumberOfDigits = this.params.length > 0 ? this.params[0] : DefaultNumberOfDigits;
    const MaxNumberOfDecimalDigits = this.params.length == 2 ? this.params[1] : null;

    // 1. Is the validated string a number?
    let validNumber;
    try {
      validNumber = new Decimal(valueToValidate);
    } catch (e) {
      resultOfValidation.addInvalidTypeError("doubleNumber.e001", "The value is not a valid decimal number.");
      return resultOfValidation;
    }

    // 2. Does the number have a correct number of digits?
    if (validNumber.precision(true) > MaxNumberOfDigits) {
      resultOfValidation.addInvalidTypeError("doubleNumber.e002", "The value exceeded maximum number of digits.");
    }

    // 3. Does the number have a correct number of decimal digits?
    if (MaxNumberOfDecimalDigits && validNumber.decimalPlaces() > MaxNumberOfDecimalDigits) {
      resultOfValidation.addInvalidTypeError("doubleNumber.e003", "The value exceeded maximum number of decimal places.");
    }

    return resultOfValidation;
  }
}

module.exports = DecimalNumberMatcher;
