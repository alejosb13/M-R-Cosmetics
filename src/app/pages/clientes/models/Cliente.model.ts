export interface Cliente {
    id: number;
    categoria_id: number;
    frecuencia_id: number;
    nombre: string;
    celular: number;
    telefono: number;
    direccion_casa: string;
    direccion_negocio: string;
    cedula: string;
    dias_cobro: string;
    fecha_vencimiento: string;
    estado: number;
    created_at?: Date;
    updated_at?: Date;
}


