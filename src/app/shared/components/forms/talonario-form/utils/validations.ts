import { Validators } from "@angular/forms";
import { FormGroupValidators } from "app/shared/utils/interfaces";

export const TalonarioValidators: FormGroupValidators = {
  max: [Validators.required],
  min: [Validators.required],
  // user_id: [Validators.required],
  // asignado: [Validators.required],

};
