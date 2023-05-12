export interface Categoria {
    id?: number;
    tipo: string;
    descripcion: string;
    // valor_dias: number;
    monto_menor: number;
    monto_maximo: number;
    condicion: number;
    estado: number;
    created_at?: Date;
    updated_at?: Date;
}