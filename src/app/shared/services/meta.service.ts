import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";
import { Meta } from "../models/meta.model";

const MetaURL = `${environment.urlAPI}metas`;

@Injectable({
  providedIn: "root",
})
export class MetaService {
  constructor(private http: HttpClient) {}

  headerJson_Token(): HttpHeaders {
    // const DataUSerStorage = this.authService.getAuthFromLocalStorage()

    let config = {
      ContentType: "application/json",
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
}
