import { Factura } from "./Factura.models";

export interface Usuario {
    id?: number;
    name: string;
    apellido: string;
    cargo: string;
    email: string;
    email_verified_at?: Date;
    estado: number;
    factura: Factura[];
    created_at?: Date;
    updated_at?: Date;
}

