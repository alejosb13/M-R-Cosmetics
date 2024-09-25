import { FormGroup, FormControl } from "@angular/forms";
import { DepartamentoValidators } from "./validations";


export interface DepartamentoForm {
  nombre: FormControl<number>;
  zona: FormControl<number>;
}

export const DepartamentosFormBuilder = (): FormGroup<DepartamentoForm> =>
  new FormGroup({
    nombre: new FormControl(null, [...DepartamentoValidators.nombre]),
    zona: new FormControl(0, [...DepartamentoValidators.zona]),
  });
