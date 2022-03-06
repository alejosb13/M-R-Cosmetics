export interface FacturaDetalle {
    id?: number;
    producto_id: number;
    factura_id?: number;
    cantidad: number;
    precio: number;
    porcentaje: number;
    nombre?: string;
    descripcion?: string;
    // comision?: number;
    estado:number;
    created_at?: Date;
    updated_at?: Date;
}