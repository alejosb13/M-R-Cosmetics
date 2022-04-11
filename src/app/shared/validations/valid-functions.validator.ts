import { AbstractControl } from '@angular/forms';

export class ValidFunctionsValidator {
  /**
   * Check matching password with confirm password
   * @param control AbstractControl
   */
  static NumberRegEx           = /^[0-9,$]*$/;
  static DecimalRegEx          = /^-?\d*[.,]?\d{0,2}$/;
  static DecimaValidCerolRegEx = /\d+(,\d+)?/;
  static NumberPhone           = /^\(?(\d{3})\)?[-]?(\d{3})[-]?(\d{4})$/;
  static Url                   = /^(https):\/\/[^ "]+$/;
  static Email                 = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
  static OnlyText              = /^[a-zA-Z \u00C0-\u017F]+$/;

  static MatchPassword(control: AbstractControl): void {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('password_confirmation')?.value;

    if (password !== confirmPassword) {
      control.get('password_confirmation')?.setErrors({ ConfirmPassword: true });
    }
  }

}
