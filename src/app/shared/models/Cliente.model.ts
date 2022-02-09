import { Categoria } from "app/shared/models/Categoria.models";
import { Factura } from "app/shared/models/Factura.models";
import { Frecuencia } from "app/shared/models/Frecuencia.models";

export interface Cliente {
    id?: number;
    categoria_id: number;
    frecuencia_id: number;
    nombre: string;
    apellido: string;
    celular: number;
    telefono: number;
    direccion_casa: string;
    direccion_negocio: string;
    cedula: string;
    dias_cobro: string;
    fecha_vencimiento: string;
    frecuencia?: Frecuencia;
    categoria?: Categoria;
    facturas?: Factura[];
    estado: number;
    created_at?: Date;
    updated_at?: Date;
}


