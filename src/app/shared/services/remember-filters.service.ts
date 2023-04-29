import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import {
  CreateFiltersForm,
  FiltersForm,
  TypesFiltersForm,
} from "../models/FiltersForm";
import { FiltrosList } from "../models/Listados.model";

@Injectable({
  providedIn: "root",
})
export class RememberFiltersService {
  private Key: string = `${environment.USERDATA_KEY_STORAGE}-FormsFilters`;

  constructor() {}

  /**
   * Devuelve los filtros guardados en el storage y si no existen devuelve un objeto nuevo
   * @returns Filters
   */
  getFilterStorage(): FiltersForm {
    let Filters: FiltersForm = JSON.parse(localStorage.getItem(this.Key));

    if (!Filters) {
      return {} as FiltersForm;
    }

    return Object.keys(Filters).length > 0 ? Filters : ({} as FiltersForm);
  }

  /**
   * Almacena en el estorage los filtros enviados como parametros
   *
   * @param form - Nombre que se le asignara al filtro en el storage
   * @param filter - Filtros que se guardaran en el storage
   */
  setFilterStorage(
    form: TypesFiltersForm,
    filter: CreateFiltersForm | FiltrosList
  ) {
    let Filters = {
      ...this.getFilterStorage(),
      [form]: filter,
    };

    localStorage.setItem(this.Key, JSON.stringify(Filters));
  }

  /**
   * Elimina los filtros de un formulario
   *
   * @param form - Nombre que del filtro en el storage
   */
  deleteFilterStorage(form: TypesFiltersForm) {
    let Filters = { ...this.getFilterStorage() };
    delete Filters[form];

    // console.log(Filters);

    localStorage.setItem(this.Key, JSON.stringify(Filters));
  }

  /**
   * Elimina todos los filtros de un formulario
   *
   * @param form - Nombre que del filtro en el storage
   */
  deleteAllFilterStorage() {
    // console.log(Filters);

    localStorage.removeItem(this.Key);
  }
}
