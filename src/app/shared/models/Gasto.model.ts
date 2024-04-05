export interface Gasto {
  id?: number;

  tipo: number;
  tipo_desc?: string;
  conceptualizacion: string;
  numero: string;
  monto: number;
  fecha_comprobante: string;

  estado?: number;
  created_at?: Date;
  updated_at?: Date;
}
