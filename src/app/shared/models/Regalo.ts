import { Producto } from './Producto.model';
import { FacturaDetalle } from './FacturaDetalle.model';

export interface Regalo {
  id?: number;
  producto_id: number;
  cantidad: number;
  id_producto_regalo: number;
  habilitado: number;
  estado: number;
  created_at?: Date;
  updated_at?: Date;
  data?: Producto;
}

export interface RegaloFacturado {
  id?: number;
  factura_detalle_id: number;
  cantidad_regalada:number
  regalo_id: number;
  estado: number;
  created_at?: Date;
  updated_at?: Date;
  data?: Producto;
  regalo?: Regalo;
  detalle_regalo?: Producto;
}
