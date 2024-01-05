import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recibo } from '../models/Recibo.model';
import { environment } from 'environments/environment';
import { ReciboHistorial, ReciboHistorialContado } from '../models/ReciboHistorial.model';

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
      'Content-Type': 'application/json',
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

  getNumeroRecibo(userId:number): Observable<any> {
    const URL = `${ReciboURL}/number/${userId}`
    return this.http.get<any>(
      URL,
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

  getReciboHistorialContado(options={}): Observable<ReciboHistorialContado[]> {
    let URL = `${ReciboURL}/historial/contado`

    if(Object.keys(options).length > 0){
      let URLOptions = `${URL}?`

      for (const key in options) {
        URLOptions += `${key}=${options[key]}&`
      }

      URL = URLOptions
    }

    return this.http.get<ReciboHistorialContado[]>(
      URL,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  getReciboHistorialCredito(options={}): Observable<ReciboHistorial[]> {
    let URL = `${ReciboURL}/historial/credito`

    if(Object.keys(options).length > 0){
      let URLOptions = `${URL}?`

      for (const key in options) {
        URLOptions += `${key}=${options[key]}&`
      }

      URL = URLOptions
    }

    return this.http.get<ReciboHistorial[]>(
      URL,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  deleteReciboHistorialContado(id:number): Observable<any> {
    let URL = `${ReciboURL}/historial/contado/${id}`

    return this.http.delete<any>(
      URL,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  deleteReciboHistorialCredito(id:number): Observable<any> {
    let URL = `${ReciboURL}/historial/credito/${id}`

    return this.http.delete<any>(
      URL,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

}
