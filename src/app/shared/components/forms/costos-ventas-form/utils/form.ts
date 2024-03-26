import { FormGroup, FormControl } from "@angular/forms";
import { CostoVentasValidators } from "./validations";

export interface CostoVentasForm {
  costo: FormControl<number>;
  producto_id: FormControl<number>;
}

export const CostosVentasFormBuilder = (): FormGroup<CostoVentasForm> =>
  new FormGroup({
    costo: new FormControl(null, [...CostoVentasValidators.costo]),
    producto_id: new FormControl(null, [...CostoVentasValidators.producto_id]),
  });
