import { Factura } from "./Factura.model";
import { Producto } from "./Producto.model";

export interface FacturaBonificacion {
    id?: number;
    producto_id: number;
    factura_id?: number;
    cantidad: number;
    precio: number;
    precio_unidad: number;
    estado: number;
    created_at?: Date;
    updated_at?: Date;
    producto?: Producto;
    factura?: Factura;
    // Campos adicionales que pueden venir del API
    marca?: string;
    modelo?: string;
    linea?: string;
    descripcion?: string;
}
