import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";
import { Factura } from "../models/Factura.model";
import { FacturaCheckout } from "../models/FacturaCheckout.model";
import { FiltrosList, ListadoModel } from "../models/Listados.model";
import { ReciboHistorial } from "../models/ReciboHistorial.model";
import { Abono } from "../models/Abono.model";
import { Cliente } from "../models/Cliente.model";
import { FacturaDetalle } from "../models/FacturaDetalle.model";

const ListadoURL = `${environment.urlAPI}list`;
const ClienteURL = `${environment.urlAPI}cliente`

@Injectable({
  providedIn: "root",
})
export class Listado {
  constructor(private http: HttpClient) {}

  FacturaCheckout: FacturaCheckout = {} as FacturaCheckout;

  headerJson_Token(): HttpHeaders {
    let config = {
      'Content-Type': "application/json",
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

  recibosList(options: FiltrosList): Observable<ListadoModel<ReciboHistorial>> {
    // console.log("FiltrosList", options);
    let URL: string;

    if (options.link) {
      URL = this.urlParams(options.link, options);
    } else {
      URL = `${ListadoURL}/recibos`;

      if (Object.keys(options).length > 0) {
        // let URLOptions = `${ListadoURL}/facturas?`

        URL = this.urlParams(URL, options);

        // URL = URLOptions
      }
    }

    // console.log(URL);

    return this.http.get<ListadoModel<ReciboHistorial>>(URL, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  abonoList(options: FiltrosList): Observable<ListadoModel<Abono>> {
    // console.log("FiltrosList", options);
    let URL: string;

    if (options.link) {
      URL = this.urlParams(options.link, options);
    } else {
      URL = `${ListadoURL}/abonos`;

      if (Object.keys(options).length > 0) {
        // let URLOptions = `${ListadoURL}/facturas?`

        URL = this.urlParams(URL, options);

        // URL = URLOptions
      }
    }

    // console.log(URL);

    return this.http.get<ListadoModel<Abono>>(URL, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  clienteProductosCompradosList(options: FiltrosList): Observable<ListadoModel<FacturaDetalle>> {
    // console.log("FiltrosList", options);
    let URL: string;

    if (options.link) {
      URL = this.urlParams(options.link, options);
    } else {
      URL = `${ListadoURL}/productos-clientes`;

      if (Object.keys(options).length > 0) {
        // let URLOptions = `${ListadoURL}/facturas?`

        URL = this.urlParams(URL, options);

        // URL = URLOptions
      }
    }

    // console.log(URL);

    return this.http.get<ListadoModel<FacturaDetalle>>(URL, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  clienteList(
    options: FiltrosList
  ): Observable<ListadoModel<Cliente> | Cliente[]> {
    // console.log("FiltrosList", options);
    let URL: string;

    if (options.link) {
      URL = this.urlParams(options.link, options);
    } else {
      URL = `${ListadoURL}/clientes`;

      if (Object.keys(options).length > 0) {
        // let URLOptions = `${ListadoURL}/facturas?`

        URL = this.urlParams(URL, options);

        // URL = URLOptions
      }
    }

    // console.log(URL);

    return this.http.get<ListadoModel<Cliente>>(URL, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  clienteListCarrito(
    options: FiltrosList
  ): Observable<any> {
    // console.log("FiltrosList", options);
    let URL: string;

    if (options.link) {
      URL = this.urlParams(options.link, options);
    } else {
      URL = `${ClienteURL}/usuario/${options.userId}`;

      if (Object.keys(options).length > 0) {
        // let URLOptions = `${ListadoURL}/facturas?`

        URL = this.urlParams(URL, options);

        // URL = URLOptions
      }
    }

    // console.log(URL);

    return this.http.get<any>(URL, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  ProductoList(
    options: any
  ): Observable<any> {
    let params = new HttpParams();
    for (const key in options) {
      params = params.append(key, options[key]);
    }

    return this.http.get<any>(`${ListadoURL}/productos`, {
      params,
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  registerClientesPDF(
    options: any
  ) {
    // console.log("FiltrosList", options);
    let URL = `${environment.urlAPI}pdf/registroclientes`;

    if (Object.keys(options).length > 0) {
      // let URLOptions = `${ListadoURL}/facturas?`
      // options.alldate = options.allDates 
      // delete options.allDates;
      URL = this.urlParams(URL, options);

      // URL = URLOptions
    }

    // console.log(URL);

    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    return this.http.get(`${URL}`, { headers: headers, responseType: 'blob' });
  }

  registerClientesCSV(
    options: any
  ) {
    let URL = `${environment.urlAPI}xlsx/registroclientes`;
    // let URL = `${environment.urlAPI}csv/registroclientes`;

    if (Object.keys(options).length > 0) {
      URL = this.urlParams(URL, options);
    }

    window.open(`${URL}`, '_blank');
  }
}
