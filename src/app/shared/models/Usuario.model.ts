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
    role_id?: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface UsuarioServ {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    apellido: string;
    cargo: string;
    estado: number;
    role: number;
}

