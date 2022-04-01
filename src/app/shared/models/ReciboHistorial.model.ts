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

