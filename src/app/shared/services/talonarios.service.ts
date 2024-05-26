import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";
import { FiltrosList } from "../models/Listados.model";
import { Talonario } from "../models/Talonario.model";

const TalonariosURL = `${environment.urlAPI}talonarios`;

@Injectable({
  providedIn: "root",
})
export class TalonariosService {
  constructor(private http: HttpClient) {}

  headerJson_Token(): HttpHeaders {
    let config = {
      "Content-Type": "application/json",
    };

    return new HttpHeaders(config);
  }

  getTalonarios(param: FiltrosList): Observable<any> {
    let URL = `${TalonariosURL}`;
    if (param.link) {
      URL = param.link;
    }

    let params = new HttpParams();
    for (const key in param) {
      let indice = key;
      let valor = param[key];

      if (indice == "link") continue;

      params = params.append(key, valor);
    }

    return this.http.get(URL, {
      params: params,
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  insertTalonario(data: Talonario): Observable<any> {
    return this.http.post(`${TalonariosURL}`, data, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  insertTalonarioLote(data: any): Observable<any> {
    return this.http.post(`${TalonariosURL}/lote`, data, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  updateTalonario(data: Talonario): Observable<any> {
    return this.http.put(`${TalonariosURL}/${data.id}`, data, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  deleteTalonario(id: number): Observable<any> {
    return this.http.delete(`${TalonariosURL}/${id}`, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  asignarTalonario(id: number): Observable<any> {
    return this.http.delete(`${TalonariosURL}/${id}`, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

}
