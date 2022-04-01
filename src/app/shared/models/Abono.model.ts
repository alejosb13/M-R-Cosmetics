import { Cliente } from "./Cliente.model";
import { Factura } from "./Factura.model";
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
    factura?: Factura;
    usuario?: Usuario;
}
