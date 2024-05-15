import { FormGroup, FormControl } from "@angular/forms";
import { TalonarioValidators } from "./validations";


export interface TalonarioForm {
  max: FormControl<number>;
  min: FormControl<number>;
  // user_id: FormControl<number>;
  // asignado: FormControl<number>;
}

export const TalonarioFormBuilder = (): FormGroup<TalonarioForm> =>
  new FormGroup({
    max: new FormControl(null, [...TalonarioValidators.max]),
    min: new FormControl(null, [...TalonarioValidators.min]),
    // user_id: new FormControl(null, [...GastoValidators.numero]),
    // asignado: new FormControl(null, [...GastoValidators.tipo_pago]),
  });
