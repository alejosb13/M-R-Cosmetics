import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@environment/environment";
const ConfiguracionURL = `${environment.urlAPI}configuracion`;

@Injectable({
  providedIn: "root",
})
export class UbicacionesService {
  constructor(private http: HttpClient) {}

  headerJson_Token(): HttpHeaders {
    // const DataUSerStorage = this.authService.getAuthFromLocalStorage()

    let config = {
      "Content-Type": "application/json",
      // 'Authorization' : `bearer ${DataUSerStorage? DataUSerStorage?.access_token: "" }`
    };

    return new HttpHeaders(config);
  }

  zonas(options: any): Observable<any> {

    let URL = `${ConfiguracionURL}/zonas`;
    if (options.link) {
      URL = options.link;
    }

    let params = new HttpParams();
    for (const key in options) {
      params = params.append(key, options[key]);
    }

    return this.http.get<any>(URL, {
      params,
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  zonasInsert(data: any): Observable<any> {
    return this.http.post<any>(`${ConfiguracionURL}/zonas`, data, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  zonasEditar(data: any,id:number): Observable<any> {
    return this.http.put<any>(`${ConfiguracionURL}/zonas/${id}`, data, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  zonaDelete(id:number): Observable<any> {
    const URL = `${ConfiguracionURL}/zonas/${id}`
    return this.http.delete(
      URL, {headers: this.headerJson_Token()}
    );
  }

  departamentos(options: any): Observable<any> {
    let URL = `${ConfiguracionURL}/departamentos`;
    if (options.link) {
      URL = options.link;
    }

    let params = new HttpParams();
    for (const key in options) {
      params = params.append(key, options[key]);
    }

    return this.http.get<any>(URL, {
      params,
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  departamentosInsert(data: any): Observable<any> {
    return this.http.post<any>(`${ConfiguracionURL}/departamentos`, data, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  departamentosEditar(data: any,id:number): Observable<any> {
    return this.http.put<any>(`${ConfiguracionURL}/departamentos/${id}`, data, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  departamentosDelete(id:number): Observable<any> {
    const URL = `${ConfiguracionURL}/departamentos/${id}`
    return this.http.delete(
      URL, {headers: this.headerJson_Token()}
    );
  }

  municipios(options: any): Observable<any> {
    let URL = `${ConfiguracionURL}/municipios`;
    if (options.link) {
      URL = options.link;
    }

    let params = new HttpParams();
    for (const key in options) {
      params = params.append(key, options[key]);
    }

    return this.http.get<any>(URL, {
      params,
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  municipiosInsert(data: any): Observable<any> {
    return this.http.post<any>(`${ConfiguracionURL}/municipios`, data, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  municipiosEditar(data: any,id:number): Observable<any> {
    return this.http.put<any>(`${ConfiguracionURL}/municipios/${id}`, data, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  municipiosDelete(id:number): Observable<any> {
    const URL = `${ConfiguracionURL}/municipios/${id}`
    return this.http.delete(
      URL, {headers: this.headerJson_Token()}
    );
  }
}
