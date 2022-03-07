export interface FacturaHistorial {
    id?: number;
    factura_id: number;
    precio: number;
    user_id: number;
    name?: string;
    apellido?: string;
    estado: number;
    created_at?: Date;
    updated_at?: Date;
}