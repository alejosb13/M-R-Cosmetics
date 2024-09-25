import { Validators } from "@angular/forms";
import { FormGroupValidators } from "app/shared/utils/interfaces";

export const MunicipioValidators: FormGroupValidators = {
  nombre: [Validators.required],
  departamento: [Validators.required],
};
