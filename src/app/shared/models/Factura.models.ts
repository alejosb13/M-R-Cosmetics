import { Cliente } from "./Cliente.model";
import { FacturaDetalle } from "./FacturaDetalle.model";
import { Usuario } from "./Usuario.model";

export interface Factura {
    id?: number;
    user_id: number;
    cliente_id: number;
    monto: number;
    nruc: string;
    fecha_vencimiento: string;
    iva: number;
    tcambio: number;
    estado: number;
    user?: Usuario;
    cliente?: Cliente;
    factura_detalle?: FacturaDetalle[];
    created_at?: Date;
    updated_at?: Date;
}

