import { Cliente } from "./Cliente.model";
import { Factura } from "./Factura.model";
import { Meta } from "./Meta.model";
import { Recibo, RecibosRangosSinTerminar } from "./Recibo.model";
import { ReciboHistorial } from './ReciboHistorial.model';

export interface Usuario {
  id?: number;
  name: string;
  apellido: string;
  cargo: string;
  email: string;
  email_verified_at?: Date;
  estado: number;
  zona_id: number;
  cedula:string
  celular:string
  domicilio:string
  fecha_nacimiento:string
  fecha_ingreso:string
  factura: Factura[];
  recibo?: Recibo;
  meta?: Meta;
  zonas?: any;
  ultimo_recibo?: ReciboHistorial;
  clientes?: Cliente[];
  role_id?: number;
  created_at?: Date;
  updated_at?: Date;
  recibosRangosSinTerminar?:RecibosRangosSinTerminar[]
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
  cedula:string
  celular:string
  domicilio:string
  zona_id: any;
  fecha_nacimiento:string
  fecha_ingreso:string
}

