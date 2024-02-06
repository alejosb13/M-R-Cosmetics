import { FormGroup, FormControl } from "@angular/forms";
import { ImportacionValidators } from "./validations";

export interface ImportacionForm {
  fecha_inversion: FormControl<string>;
  numero_recibo: FormControl<string>;
  numero_inversion: FormControl<any>;
  monto_compra: FormControl<number>;
  conceptualizacion: FormControl<string>;
  precio_envio: FormControl<number>;
}

export const ImportacionFormBuilder = (): FormGroup<ImportacionForm> =>
  // new FormArray([new FormGroup<InversionForm>(inversionFormStructure)]);
  new FormGroup({
    fecha_inversion: new FormControl(null, [
      ...ImportacionValidators.fecha_inversion,
    ]),
    numero_recibo: new FormControl(null, [
      ...ImportacionValidators.numero_recibo,
    ]),
    numero_inversion: new FormControl(null, [
      ...ImportacionValidators.numero_inversion,
    ]),
    monto_compra: new FormControl(null, [
      ...ImportacionValidators.monto_compra,
    ]),
    conceptualizacion: new FormControl(null, [
      ...ImportacionValidators.conceptualizacion,
    ]),
    precio_envio: new FormControl(null, [...ImportacionValidators.precio_envio]),
  });
