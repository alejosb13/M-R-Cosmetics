import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";
import { Factura } from "../models/Factura.model";
import { FacturaCheckout } from "../models/FacturaCheckout.model";
import { FiltrosList, ListadoModel } from "../models/Listados.model";

const ListadoURL = `${environment.urlAPI}list`;

@Injectable({
  providedIn: "root",
})
export class Listado {
  constructor(private http: HttpClient) {}

  FacturaCheckout: FacturaCheckout = {} as FacturaCheckout;

  headerJson_Token(): HttpHeaders {
    let config = {
      ContentType: "application/json",
    };

    return new HttpHeaders(config);
  }

  private urlParams(URLOptions: string, options: FiltrosList): string {
    URLOptions += !options.link ? "?" : "&";

    for (const key in options) {
      if (key != "link") {
        URLOptions += `${key}=${options[key]}&`;
      }
    }

    return URLOptions;
  }

  // public methods
  getFacturas(options: FiltrosList): Observable<ListadoModel<Factura>> {
    // console.log("FiltrosList", options);
    let URL: string;

    if (options.link) {
      URL = this.urlParams(options.link, options);
    } else {
      URL = `${ListadoURL}/facturas`;

      if (Object.keys(options).length > 0) {
        // let URLOptions = `${ListadoURL}/facturas?`

        URL = this.urlParams(URL, options);

        // URL = URLOptions
      }
    }

    // console.log(URL);

    return this.http.get<ListadoModel<Factura>>(URL, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  metasHistoricoList(options: FiltrosList): Observable<ListadoModel<Factura>> {
    // console.log("FiltrosList", options);
    let URL: string;

    if (options.link) {
      URL = this.urlParams(options.link, options);
    } else {
      URL = `${ListadoURL}/metas`;

      if (Object.keys(options).length > 0) {
        // let URLOptions = `${ListadoURL}/facturas?`

        URL = this.urlParams(URL, options);

        // URL = URLOptions
      }
    }

    // console.log(URL);

    return this.http.get<ListadoModel<Factura>>(URL, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }
}
