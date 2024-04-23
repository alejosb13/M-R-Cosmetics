import { FormGroup, FormControl } from "@angular/forms";
import { GastoValidators } from "@app/shared/components/forms/gasto-form/utils/validations";


export interface GastosForm {
  tipo: FormControl<number>;
  conceptualizacion: FormControl<string>;
  numero: FormControl<string>;
  tipo_pago: FormControl<number>;
  pago_desc: FormControl<string>;
  monto: FormControl<number>;
  fecha_comprobante: FormControl<string>;

}

export const GastoFormBuilder = (): FormGroup<GastosForm> =>
  new FormGroup({
    tipo: new FormControl(null, [...GastoValidators.tipo]),
    conceptualizacion: new FormControl(null, [...GastoValidators.conceptualizacion]),
    numero: new FormControl(null, [...GastoValidators.numero]),
    tipo_pago: new FormControl(null, [...GastoValidators.tipo_pago]),
    pago_desc: new FormControl(null, [...GastoValidators.pago_desc]),
    monto: new FormControl(null, [...GastoValidators.monto]),
    fecha_comprobante: new FormControl(null, [...GastoValidators.fecha_comprobante]),
  });
