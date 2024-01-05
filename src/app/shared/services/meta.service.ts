import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";
import { Meta } from "../models/meta.model";

const MetaURL = `${environment.urlAPI}metas`;
const MetaHistorialURL = `${environment.urlAPI}metas-historial`;

@Injectable({
  providedIn: "root",
})
export class MetaService {
  constructor(private http: HttpClient) {}

  IsLoad: boolean = false;

  headerJson_Token(): HttpHeaders {
    // const DataUSerStorage = this.authService.getAuthFromLocalStorage()

    let config = {
      'Content-Type': "application/json",
      // 'Authorization' : `bearer ${DataUSerStorage? DataUSerStorage?.access_token: "" }`
    };

    return new HttpHeaders(config);
  }

  // public methods
  getMeta(): Observable<Meta> {
    return this.http.get<Meta>(MetaURL, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  insertMeta(data: Meta): Observable<any> {
    return this.http.post<any>(MetaURL, data, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  updateMeta(Id: number, data: Meta): Observable<any> {
    const URL = `${MetaURL}/${Id}`;

    return this.http.put<any>(URL, data, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  updateMetaHistorial(
    Id: number,
    data: { fecha_asignacion: string; monto_meta: number }
  ): Observable<any> {
    const URL = `${MetaHistorialURL}/${Id}`;

    return this.http.put<any>(URL, data, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  deleteMetaHistorial(Id: number): Observable<any> {
    const URL = `${MetaHistorialURL}/${Id}`;

    return this.http.delete<any>(URL, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  newMetaHistorial(mes: string): Observable<any> {
    const URL = `${MetaHistorialURL}/new`;

    return this.http.post<any>(
      URL,
      { mes },
      {
        headers: this.headerJson_Token(),
        responseType: "json",
      }
    );
  }
}
