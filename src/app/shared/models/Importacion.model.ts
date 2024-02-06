import { InversionResponse } from "./Inversion.model";

export interface Importacion {
  fecha_inversion: string;
  numero_recibo: string;
  numero_inversion: string;
  monto_compra: number;
  conceptualizacion: string;
  precio_envio: number;
  inversion_id?: number;
}

export interface ImportacionResponse extends Importacion {
  updated_at: string;
  created_at: string;
  inversion: InversionResponse;
}
