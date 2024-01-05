import { FormGroup, FormControl, FormArray } from "@angular/forms";
import { InversionValidators } from "./validations";

export interface InversionForm {
  codigo: FormControl<string>;
  producto: FormControl<string>;
  marca: FormControl<string>;
  cantidad: FormControl<number>;
  precio_unitario: FormControl<number>;
  costo: FormControl<number>;
  peso_porcentual: FormControl<number>;
  peso_absoluto: FormControl<number>;
  c_u_distribuido: FormControl<number>;
  costo_total: FormControl<number>;
  subida_ganancia: FormControl<number>;
  precio_venta: FormControl<number>;
  margen_ganancia: FormControl<number>;
  venta: FormControl<number>;
  venta_total: FormControl<number>;
  costo_real: FormControl<number>;
  ganancia_bruta: FormControl<number>;
  comision_vendedor: FormControl<number>;
}

export const inversionFormStructure = () => ({
  codigo: new FormControl("", [...InversionValidators.codigo]),
  producto: new FormControl("", [...InversionValidators.producto]),
  marca: new FormControl("", [...InversionValidators.marca]),
  cantidad: new FormControl(null, [...InversionValidators.cantidad]),
  precio_unitario: new FormControl(null, [
    ...InversionValidators.precio_unitario,
  ]),
  costo: new FormControl(null, [...InversionValidators.costo]),
  peso_porcentual: new FormControl(null, [
    ...InversionValidators.peso_porcentual,
  ]),
  peso_absoluto: new FormControl(null, [...InversionValidators.peso_absoluto]),
  c_u_distribuido: new FormControl(null, [
    ...InversionValidators.c_u_distribuido,
  ]),
  costo_total: new FormControl(null, [...InversionValidators.costo_total]),
  subida_ganancia: new FormControl(null, [
    ...InversionValidators.subida_ganancia,
  ]),
  precio_venta: new FormControl(null, [...InversionValidators.precio_venta]),
  margen_ganancia: new FormControl(null, [
    ...InversionValidators.margen_ganancia,
  ]),
  venta: new FormControl(null, [...InversionValidators.venta]),
  venta_total: new FormControl(null, [...InversionValidators.venta_total]),
  costo_real: new FormControl(null, [...InversionValidators.costo_real]),
  ganancia_bruta: new FormControl(null, [
    ...InversionValidators.ganancia_bruta,
  ]),
  comision_vendedor: new FormControl(null, [
    ...InversionValidators.comision_vendedor,
  ]),
});

export const inversionTotalValues = () => ({
  cantidad: 0,
  costo: 0,
  peso_porcentual: 0,
  costo_total: 0,
  precio_venta: 0,
  venta_total: 0,
  costo_real: 0,
  ganancia_bruta: 0,
  comision_vendedor: 0,
});

export const InversionFormBuilder = () =>
  // new FormArray([new FormGroup<InversionForm>(inversionFormStructure)]);
  new FormGroup({
    inversion: new FormArray([
      new FormGroup<InversionForm>(inversionFormStructure()),
    ]),
  });

export const FormatInDecimalToFixed = (valor: number, decimales: number = 2):number =>
Number(Number(valor).toFixed(decimales));
