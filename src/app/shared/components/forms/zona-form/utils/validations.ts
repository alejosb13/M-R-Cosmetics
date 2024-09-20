import { Validators } from "@angular/forms";
import { FormGroupValidators } from "app/shared/utils/interfaces";

export const ZonaValidators: FormGroupValidators = {
  nombre: [Validators.required],
};
