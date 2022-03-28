import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recibo } from '../models/Recibo.model';
import { environment } from 'environments/environment';

const ReciboURL = `${environment.urlAPI}recibos`

@Injectable({
  providedIn: 'root'
})
export class ReciboService {
  constructor(
    private http: HttpClient
  ) { }

  headerJson_Token():HttpHeaders{
    // const DataUSerStorage = this.authService.getAuthFromLocalStorage()

    let config = {
      ContentType: 'application/json',
      // 'Authorization' : `bearer ${DataUSerStorage? DataUSerStorage?.access_token: "" }`
    };

    return new HttpHeaders(config);
  }

  // public methods
  getRecibo(): Observable<Recibo> {

    return this.http.get<Recibo>(
      ReciboURL,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  getReciboById(Id:number): Observable<Recibo> {
    const URL = `${ReciboURL}/${Id}`

    return this.http.get<Recibo>(
      URL,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  insertRecibo(data:Recibo): Observable<any> {

    return this.http.post<any>(
      ReciboURL,
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  updateRecibo(Id:number,data:Recibo): Observable<any> {
    const URL = `${ReciboURL}/${Id}`

    return this.http.put<any>(
      URL,
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  deleteRecibo(id:number): Observable<any> {
    const URL = `${ReciboURL}/${id}`
    return this.http.delete(
      URL, {headers: this.headerJson_Token()}
    );
  }
}
