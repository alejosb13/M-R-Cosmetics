import { Usuario } from "./Usuario.model";

export interface InversionDetail {
  codigo: string;
  producto: string;
  marca: string;
  cantidad: number;
  precio_unitario: number;
  porcentaje_ganancia: number;
  costo: number;
  peso_porcentual: number;
  peso_absoluto: number;
  c_u_distribuido: number;
  costo_total: number;
  subida_ganancia: number;
  precio_venta: number;
  margen_ganancia: number;
  venta: number;
  venta_total: number;
  costo_real: number;
  ganancia_bruta: number;
  comision_vendedor: number;
}

export interface InversionesTotales {
  cantidad: number,
  costo: number,
  peso_porcentual: number,
  costo_total: number,
  precio_venta: number,
  venta_total: number,
  costo_real: number,
  ganancia_bruta: number,
  comision_vendedor: number,
  ganancia_total: number,
}

export interface InversionGeneral {
  envio: number;
  porcentaje_comision_vendedor: number;
  inversion: InversionDetail[];
}

export interface InversionResponse {
  id: number
  user_id: number
  cantidad_total: number
  costo: number
  peso_porcentual_total: number
  costo_total: number
  precio_venta: number
  venta_total: number
  costo_real_total: number
  ganancia_bruta_total: number
  comision_vendedor_total: number
  envio: number
  porcentaje_comision_vendedor: number
  estatus_cierre: number
  estado: number
  created_at: string
  updated_at: string
  user: Usuario
  inversion_detalle: InversionDetail[]
}