export interface Producto {
    id?: number;
    marca: string;
    modelo: string;
    stock: number;
    precio: number;
    precio_unidad?: number;
    // comision: number;
    linea: string;
    descripcion: string;
    estado: number;
    created_at?: Date;
    updated_at?: Date;
}
