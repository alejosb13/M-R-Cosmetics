export interface Recibo {
  id?: number;
  min: number;
  max: number;
  user_id: number;
  recibo_cerrado: number;
  estado: number;
  created_at?: Date;
  updated_at?: Date;
}
