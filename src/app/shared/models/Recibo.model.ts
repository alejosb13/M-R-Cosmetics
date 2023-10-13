import { Usuario } from "./Usuario.model";

export interface Recibo {
  id?: number;
  min: number;
  max: number;
  user_id: number;
  recibo_cerrado: number;
  estado: number;
  created_at?: Date;
  updated_at?: Date;
  user?: Usuario;
}

export interface RecibosRangosSinTerminar {
  id?: number
  user_id: number
  rango: string
  recibos_faltantes: string
  habilitado: number
  estado: number
  created_at?: string
  updated_at?: string
}
