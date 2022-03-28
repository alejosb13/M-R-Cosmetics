import { Factura } from "./Factura.model";
import { Recibo } from "./Recibo.model";

export interface Usuario {
  id?: number;
  name: string;
  apellido: string;
  cargo: string;
  email: string;
  email_verified_at?: Date;
  estado: number;
  factura: Factura[];
  recibo?: Recibo;
  role_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface UsuarioServ { // se usa para insertar o modificar
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  apellido: string;
  cargo: string;
  estado: number;
  role: number;
}

