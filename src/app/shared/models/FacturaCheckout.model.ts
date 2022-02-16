import { FacturaDetalle } from "./FacturaDetalle.model";

export interface FacturaCheckout {
    id?: number;
    user_id: number;
    userFullName: string;
    cliente_id: number;
    clienteFullName: string;
    monto: number;
    nruc?: string;
    fecha_vencimiento: string;
    iva: number;
    tcambio: number;
    estado: number;
    factura_detalle?: FacturaDetalle[];
}

