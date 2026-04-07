import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Abono } from "../models/Abono.model";

const AbonoURL = `${environment.urlAPI}abonos`;

@Injectable({
  providedIn: "root",
})
export class AbonoService {
  isLoad: boolean = false;
  constructor(private http: HttpClient) {}

  headerJson_Token(): HttpHeaders {
    // const DataUSerStorage = this.authService.getAuthFromLocalStorage()

    let config = {
      "Content-Type": "application/json",
      // 'Authorization' : `bearer ${DataUSerStorage? DataUSerStorage?.access_token: "" }`
    };

    return new HttpHeaders(config);
  }

  // public methods
  getAbono(): Observable<Abono[]> {
    return this.http.get<Abono[]>(AbonoURL, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  getAbonoById(Id: number): Observable<any> {
    const URL = `${AbonoURL}/${Id}`;

    return this.http.get(URL, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  insertAbono(data: any): Observable<any> {
    return this.http.post<any>(AbonoURL, data, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  updateAbono(Id: number, data: any): Observable<any> {
    const URL = `${AbonoURL}/${Id}`;

    return this.http.put<Abono>(URL, data, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  deleteAbono(id: number): Observable<any> {
    const URL = `${AbonoURL}/${id}`;
    return this.http.delete(URL, { headers: this.headerJson_Token() });
  }

  AbonosExcell(options: any): Observable<Blob> {
    let URL = `${environment.urlAPI}xlsx/abonos`;

    // Construye los parámetros utilizando HttpParams
    let params = new HttpParams();
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        params = params.append(key, options[key]);
      }
    }

    // Realiza la petición GET con responseType blob para descargar el archivo
    // Esto mantiene las cookies/autenticación del navegador
    return this.http.get<Blob>(URL, {
      params: params,
      responseType: "blob" as "json",
      headers: this.headerJson_Token(),
    });
  }

  validarPagosExcel(data: any[]): Observable<any> {
    const URL = `${environment.urlAPI}abonos/validar-excel`;
    return this.http.post<any>(URL, { pagos: data }, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  checkValidReferencia(referencia: number | string): Observable<any> {
    const URL = `${environment.urlAPI}abonos/check-valid-referencia`;
    return this.http.post<any>(URL, { referencia }, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  cargarResumenBancario(pagos: any[]): Observable<any> {
    const URL = `${environment.urlAPI}abonos/cargar-resumen-bancario`;
    return this.http.post<any>(URL, { pagos }, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  validarResumenBancario(data: { fechaInicio: string; fechaFin: string; moneda: string }): Observable<any> {
    const URL = `${environment.urlAPI}abonos/validar-excel`;
    return this.http.post<any>(URL, data, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  desestimiarResumenBancario(data: { id: number; factura_historial_id: number | null; motivo: string | null }): Observable<any> {
    const URL = `${environment.urlAPI}abonos/desestimar-resumen`;
    return this.http.post<any>(URL, data, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }
}
