import { Validators } from "@angular/forms";
import { FormGroupValidators } from "app/shared/utils/interfaces";

export const CostoVentasValidators: FormGroupValidators = {
  costo: [Validators.required, Validators.maxLength(80)],
  producto_id: [],
};
