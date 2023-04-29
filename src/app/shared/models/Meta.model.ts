import { Usuario } from "./Usuario.model";

export interface Meta {
    id?: number;
    user_id?: number;
    monto: number;
    estado?: number;
    created_at?: Date;
    updated_at?: Date;
    user?:Usuario
}

export interface MetaHistorial {
    id?: number;
    user_id?: number;
    monto_meta: number;
    estado?: number;
    fecha_asignacion?: string;
    created_at?: Date;
    updated_at?: Date;
    user?:Usuario
}