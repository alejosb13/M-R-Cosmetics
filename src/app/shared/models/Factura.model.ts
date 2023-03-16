import { Cliente } from "./Cliente.model";
import { FacturaDetalle } from "./FacturaDetalle.model";
import { FacturaHistorial } from "./FacturaHistorial.model";
import { Regalo } from "./Regalo";
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
    tipo_venta?:number;
    status: number;
    despachado: number;
    user?: Usuario;
    cliente?: Cliente;
    regalos?: Regalo[];
    // factura_historial?: FacturaHistorial[];
    factura_detalle?: FacturaDetalle[];
    created_at?: Date;
    updated_at?: Date;
}


