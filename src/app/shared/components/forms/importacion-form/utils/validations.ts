import { Validators } from "@angular/forms";
import { FormGroupValidators } from "app/shared/utils/interfaces";

export const ImportacionValidators: FormGroupValidators = {
  fecha_inversion: [Validators.required, Validators.maxLength(80)],
  numero_recibo: [Validators.required, Validators.maxLength(80)],
  numero_inversion: [Validators.required, Validators.maxLength(80)],
  monto_compra: [Validators.required, Validators.maxLength(80)],
  conceptualizacion: [Validators.required, Validators.maxLength(80)],
  precio_envio: [Validators.required, Validators.maxLength(80)],
};
