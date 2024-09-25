import { Validators } from "@angular/forms";
import { FormGroupValidators } from "app/shared/utils/interfaces";

export const DepartamentoValidators: FormGroupValidators = {
  nombre: [Validators.required],
  zona: [Validators.required],
};
