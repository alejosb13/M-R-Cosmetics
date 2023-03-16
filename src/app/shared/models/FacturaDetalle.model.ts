import { Producto } from "./Producto.model";
import { RegaloFacturado } from './Regalo';

export interface FacturaDetalle {
    id?: number;
    producto_id: number;
    factura_id?: number;
    cantidad: number;
    precio: number;
    precio_unidad: number;
    porcentaje: number;
    nombre?: string;
    descripcion?: string;
    // comision?: number;
    estado:number;
    created_at?: Date;
    updated_at?: Date;
    producto?: Producto;
    regalo_facturado?: RegaloFacturado[];
}
