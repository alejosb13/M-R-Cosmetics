import { FacturaDetalle } from "./FacturaDetalle.model";
import { Usuario } from "./Usuario.model";

export interface DevolucionProducto {
  id?: number;
  factura_detalle_id: number;
  user_id: number;
  descripcion?: string;
  cantidad: number;
  estado: number;
  created_at?: Date;
  updated_at?: Date;
  factura_detalle?: FacturaDetalle;
  user?: Usuario;
}
