import { Validators } from "@angular/forms";
import { FormGroupValidators } from "app/shared/utils/interfaces";

export const InversionValidators: FormGroupValidators = {
  envio: [Validators.required, Validators.maxLength(80)],
  porcentaje_comision_vendedor: [Validators.required, Validators.maxLength(80)],
  codigo: [Validators.maxLength(80)],
  producto: [Validators.required, Validators.maxLength(80)],
  marca: [Validators.required, Validators.maxLength(80)],
  cantidad: [Validators.required, Validators.maxLength(80)],
  precio_unitario: [Validators.required, Validators.maxLength(80)],
  porcentaje_ganancia: [Validators.required, Validators.maxLength(80)],
  costo: [],
  peso_porcentual: [],
  peso_absoluto: [],
  c_u_distribuido: [],
  costo_total: [],
  subida_ganancia: [],
  precio_venta: [],
  margen_ganancia: [],
  venta: [],
  venta_total: [],
  costo_real: [],
  ganancia_bruta: [],
  comision_vendedor: [],
  isNew: [],
  linea: [],
  modelo: [],
};
