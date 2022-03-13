export interface Categoria {
    id?: number;
    tipo: string;
    descripcion: string;
    valor_dias: number;
    estado: number;
    created_at?: Date;
    updated_at?: Date;
}