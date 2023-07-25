import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

const ConfiguracionURL = `${environment.urlAPI}configuracion`;

@Injectable({
  providedIn: "root",
})
export class ConfiguracionService {
  constructor(private http: HttpClient) {}

  headerJson_Token(): HttpHeaders {
    // const DataUSerStorage = this.authService.getAuthFromLocalStorage()

    let config = {
      ContentType: "application/json",
      // 'Authorization' : `bearer ${DataUSerStorage? DataUSerStorage?.access_token: "" }`
    };

    return new HttpHeaders(config);
  }

  migracion(
    userFrom: number,
    userTo: number,
    idclientes: number[]
  ): Observable<any> {
    return this.http.post(
      `${ConfiguracionURL}/migracion`,
      {
        userFrom,
        userTo,
        idclientes,
      },
      { headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  getTaza(): Observable<any> {
    return this.http.get(`${ConfiguracionURL}/taza-cambio`, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  setTaza(monto: number, user_id: number): Observable<any> {
    return this.http.post(
      `${ConfiguracionURL}/taza-cambio`,
      {
        monto,
        user_id,
      },
      { headers: this.headerJson_Token(), responseType: "json" }
    );
  }
  
  getTazaFactura(facturaid:number): Observable<any> {
    return this.http.get(`${ConfiguracionURL}/taza-cambio/factura/${facturaid}`, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }
  
  setTazaFactura(monto: number, factura_id: number): Observable<any> {
    return this.http.post(
      `${ConfiguracionURL}/taza-cambio/factura`,
      {
        monto,
        factura_id,
      },
      { headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  updateTazaFactura(monto: number, factura_id: number): Observable<any> {
    return this.http.patch(
      `${ConfiguracionURL}/taza-cambio/factura`,
      {
        monto,
        factura_id,
      },
      { headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  getCierraConfig(): Observable<any> {
    return this.http.get(
      `${ConfiguracionURL}/cierre`,
      { headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  updateCierraConfig(): Observable<any> {
    return this.http.put(
      `${ConfiguracionURL}/cierre`,
      { headers: this.headerJson_Token(), responseType: "json" }
    );
  }
}
