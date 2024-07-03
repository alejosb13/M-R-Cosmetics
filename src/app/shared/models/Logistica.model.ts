import { Factura } from "./Factura.model";

export interface CarteraDate{
  factura: Factura[];
  total:number;
  recuperacion?:number;
  total_saldo?:number;
}

export interface CarteraDateBodyForm{
  dateIni: string
  dateFin: string
  userId? : number
  tipo_venta? : number
  status_pagado? : number
  allDates? : boolean
  allUsers? : boolean
  allNumber? : boolean
  numDesde?:number
  numHasta?:number
  tipos?:number
  numRecibo?:number
  diasCobros?: string[]
}
