import { FacturaDetalle } from "./FacturaDetalle.model";

export interface FacturaCheckout {
    id?: number;
    user_id: number;
    userFullName: string;
    cliente_id: number;
    clienteFullName: string;
    monto: number;
    precio_unidad?: number;
    nruc?: string;
    fecha_vencimiento: string;
    iva: number;
    tipo_venta:number;
    tipo_precio?: 'contado' | 'credito'; // Kshea: indica si el carrito es contado o crédito
    despachado:number;
    // tcambio: number;
    status_pagado:boolean;
    estado: number;
    factura_detalle?: FacturaDetalle[];
}

