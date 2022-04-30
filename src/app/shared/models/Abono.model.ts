import { Cliente } from "./Cliente.model";
import { Factura } from "./Factura.model";
import { ReciboHistorial } from "./ReciboHistorial.model";
import { Usuario } from "./Usuario.model";

export interface Abono{
    id: number;
    cliente_id: number;
    user_id: number;
    precio: number;
    estado: number;
    created_at: Date;
    updated_at: Date;
    cliente?: Cliente;
    // factura?: Factura;
    recibo_historial?: ReciboHistorial;
    usuario?: Usuario;
}
