import { Factura } from "./Factura.model";
import { Usuario } from "./Usuario.model";

export interface DevolucionProducto {
  id?: number;
  factura_id: number;
  descripcion?: any;
  estado: number;
  created_at?: Date;
  updated_at?: Date;
  factura?: Factura;
  user?: Usuario;
}
