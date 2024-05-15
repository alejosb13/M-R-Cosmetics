import { Usuario } from "./Usuario.model";

export interface Talonario {
  id?: number;
  
  max: number;
  min: number;
  user_id: number | null;
  user?: Usuario | null;
  asignado: number;

  estado?: number;
  created_at?: Date;
  updated_at?: Date;
}
