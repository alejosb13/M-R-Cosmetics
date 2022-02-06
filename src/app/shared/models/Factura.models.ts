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
    created_at?: Date;
    updated_at?: Date;
}