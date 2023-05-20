import { CarteraDateBodyForm } from "./Logistica.model"

export interface FiltersForm{
  carteraFilter:CarteraDateBodyForm,
  recuperacionFilter:CarteraDateBodyForm,
  mora30_60Filter:CarteraDateBodyForm,
}

enum TypesForm {
  carteraFilter = "carteraFilter",
  recuperacionFilter = "recuperacionFilter",
  mora30_60Filter = "mora30_60Filter",
  mora60_90Filter = "mora30_60Filter",
  clientesNuevosFilter = "clientesNuevosFilter",
  incentivosFilter = "incentivosFilter",
  clientesInactivosFilter = "clientesInactivosFilter",
  clientesReactivadosFilter = "clientesReactivadosFilter",
  ventasFilter = "ventasFilter",
  productosVendidosFilter = "productosVendidosFilter",
  recuperacionMensualFilter = "recuperacionMensualFilter",
  metasHistorialFilter = "metasHistorialFilter",
  recibosHistorialFilter = "recibosHistorialFilter",
}

export type TypesFiltersForm =  keyof typeof TypesForm

export type CreateFiltersForm = Partial<FiltersForm>