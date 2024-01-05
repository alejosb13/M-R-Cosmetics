export interface Inversion {
  codigo: string;
  producto: string;
  marca: string;
  cantidad: number;
  precio_unitario: number;
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
}