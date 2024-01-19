import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";
import { Factura } from "../models/Factura.model";
import { InversionesTotales, InversionGeneral } from "../models/Inversion";
import { FiltrosList } from "../models/Listados.model";

const FinanzasURL = `${environment.urlAPI}finanzas`;

@Injectable({
  providedIn: "root",
})
export class FinanzasService {
  constructor(private http: HttpClient) {}

  headerJson_Token(): HttpHeaders {
    let config = {
      "Content-Type": "application/json",
    };

    return new HttpHeaders(config);
  }

  getInversiones(param: FiltrosList): Observable<any> {
    const URL = `${FinanzasURL}/inversion`;
    console.log(param);

    let params = new HttpParams();
    for (const key in param) {
      params = params.append(key, param[key]);
    }

    return this.http.get<Factura>(URL, {
      params: params,
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  getInversionById(id: number): Observable<any> {
    const URL = `${FinanzasURL}/inversion/${id}`;

    return this.http.get<Factura>(URL, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  insertInversion(data: {
    InversionGeneral: InversionGeneral;
    Totales: InversionesTotales;
    userId: number;
  }): Observable<any> {
    return this.http.post(`${FinanzasURL}/inversion`, data, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  updateInversion(
    data: {
      InversionGeneral: InversionGeneral;
      Totales: InversionesTotales;
      userId: number;
    },
    id: number
  ): Observable<any> {
    return this.http.put(`${FinanzasURL}/inversion/${id}`, data, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  deleteInversion(id: number): Observable<any> {
    return this.http.delete(`${FinanzasURL}/inversion/${id}`, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  changeValueInversion(id: number, param: any): Observable<any> {
    // api/finanzas/inversion/{inversion}/edit

    let params = new HttpParams();
    for (const key in param) {
      params = params.append(key, param[key]);
    }

    return this.http.get(`${FinanzasURL}/inversion/${id}/edit`, {
      params: params,
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  // entregarFactura(id: number): Observable<any> {
  //   const URL = `${FacturaURL}/entregada/${id}`;
  //   return this.http.put(URL, { headers: this.headerJson_Token() });
  // }
}
