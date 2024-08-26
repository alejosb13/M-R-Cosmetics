import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

const CronURL = `${environment.urlAPI}configuracion`;

@Injectable({
  providedIn: "root",
})
export class CronService {
  isLoad: boolean = false;

  constructor(private http: HttpClient) {}

  private headerJson_Token(): HttpHeaders {
    // const DataUSerStorage = this.authService.getAuthFromLocalStorage()

    let config = {
      'Content-Type': "application/json",
      // 'Authorization' : `bearer ${DataUSerStorage? DataUSerStorage?.access_token: "" }`
    };

    return new HttpHeaders(config);
  }

  // public methods
  getRefreshIndices({
    roleId,
    roleName,
    userId,
    disablePaginate,
    estado
  }: {
    roleId: number;
    roleName: string;
    userId: number;
    disablePaginate: number;
    estado: number;
  }): Observable<any> {
    const URL = `${CronURL}/refresh-indice`;
    // return this.http.get<any[]>(
    //   URL,
    //   {headers: this.headerJson_Token(), responseType: "json" }
    let queryParams = new HttpParams();
    queryParams = queryParams.append("roleId", roleId);
    queryParams = queryParams.append("roleName", roleName);
    queryParams = queryParams.append("userId", userId);
    queryParams = queryParams.append("disablePaginate", disablePaginate);
    queryParams = queryParams.append("estado", estado);

    return this.http.get<any>(URL, { params: queryParams });
  }
}
