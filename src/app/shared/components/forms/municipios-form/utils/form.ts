import { FormGroup, FormControl } from "@angular/forms";
import { MunicipioValidators } from "./validations";


export interface MunicipioForm {
  nombre: FormControl<number>;
  departamento: FormControl<number>;
}

export const MunicipiosFormBuilder = (): FormGroup<MunicipioForm> =>
  new FormGroup({
    nombre: new FormControl(null, [...MunicipioValidators.nombre]),
    departamento: new FormControl(0, [...MunicipioValidators.departamento]),
  });
