import { FormGroup, FormControl } from "@angular/forms";
import { ZonaValidators } from "./validations";


export interface ZonaForm {
  nombre: FormControl<number>;
}

export const ZonaFormBuilder = (): FormGroup<ZonaForm> =>
  new FormGroup({
    nombre: new FormControl(null, [...ZonaValidators.nombre]),
  });
