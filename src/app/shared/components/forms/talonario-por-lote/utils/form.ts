import { FormGroup, FormControl } from "@angular/forms";
import { TalonarioValidators } from "./validations";


export interface TalonarioForm {
  inicio: FormControl<number>;
  cantidad: FormControl<number>;
  nroXlote: FormControl<number>;
}

export const TalonarioFormBuilder = (): FormGroup<TalonarioForm> =>
  new FormGroup({
    inicio: new FormControl(null, [...TalonarioValidators.inicio]),
    cantidad: new FormControl(null, [...TalonarioValidators.cantidad]),
    nroXlote: new FormControl(null, [...TalonarioValidators.nroXlote])
  });
