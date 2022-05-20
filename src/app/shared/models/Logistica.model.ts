import { Factura } from "./Factura.model";

export interface CarteraDate{
  factura: Factura[];
  total:number;
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
  numRecibo?:number
}
