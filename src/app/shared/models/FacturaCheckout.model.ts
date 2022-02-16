import { FacturaDetalle } from "./FacturaDetalle.model";

export interface FacturaCheckout {
    id?: number;
    user_id: number;
    cliente_id: number;
    monto: number;
    nruc?: string;
    fecha_vencimiento: string;
    iva: number;
    tcambio: number;
    estado: number;
    factura_detalle?: FacturaDetalle[];
}

