import { Validators } from "@angular/forms";
import { FormGroupValidators } from "app/shared/utils/interfaces";

export const TalonarioValidators: FormGroupValidators = {
  inicio: [Validators.required],
  cantidad: [Validators.required],
  nroXlote: [Validators.required],
};
