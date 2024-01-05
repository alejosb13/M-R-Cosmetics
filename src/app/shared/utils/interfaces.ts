import { ValidatorFn } from "@angular/forms";

export interface FormErrorMessages {
  [key: string]: { [key: string]: string };
}

export interface FormGroupValidators {
  [key: string]: ValidatorFn[];
}