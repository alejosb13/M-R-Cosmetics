import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function customValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null; // no error if the value is empty, use required validator for that
    }

    const regex = /^\d{13}[A-Z]$/;
    const valid = regex.test(value);

    return valid
      ? null
      : {
          customError:
            "Los primeros 13 caracteres deben ser números y el 14º debe ser una letra en Mayúscula.",
        };
  };
}
