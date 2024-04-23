import { Validators } from "@angular/forms";
import { FormGroupValidators } from "app/shared/utils/interfaces";

export const GastoValidators: FormGroupValidators = {
  tipo: [Validators.required],
  conceptualizacion: [Validators.required, Validators.maxLength(160)],
  numero: [Validators.required, Validators.maxLength(80)],
  tipo_pago: [Validators.required, Validators.maxLength(80)],
  pago_desc: [Validators.required, Validators.maxLength(160)],
  monto: [Validators.required, Validators.maxLength(16)],
  fecha_comprobante: [Validators.required],
};
