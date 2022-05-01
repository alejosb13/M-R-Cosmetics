import { Factura } from "./Factura.model";
import { FacturaHistorial } from "./FacturaHistorial.model";
import { Recibo } from "./Recibo.model";

export interface ReciboHistorial {
    id?: number;
    numero: number;
    recibo_id: number;
    factura_historial_id?: number;
    rango: string;
    debitado: number;
    estado: number;
    created_at?: any;
    updated_at?: any;
    recibo?: Recibo;
    factura_historial?: FacturaHistorial;
}

export interface ReciboHistorialContado {
  id?: number;
  numero: number;
  recibo_id: number;
  factura_id?: number;
  rango: string;
  estado: number;
  created_at?: any;
  updated_at?: any;
  recibo?: Recibo;
  factura?: Factura;
}

