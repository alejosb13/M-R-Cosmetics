import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Factura } from '../models/Factura.model';
import { FacturaCheckout } from '../models/FacturaCheckout.model';
import { FacturaDetalle } from '../models/FacturaDetalle.model';

const FacturaURL = `${environment.urlAPI}factura-detalle`

@Injectable({
  providedIn: 'root'
})
export class FacturaDetalleService {
  constructor(
    private http: HttpClient
  ) { }

  FacturaCheckout:FacturaCheckout = {} as FacturaCheckout;

  headerJson_Token():HttpHeaders{
    // const DataUSerStorage = this.authService.getAuthFromLocalStorage()

    let config = {
      'Content-Type': 'application/json',
      // 'Authorization' : `bearer ${DataUSerStorage? DataUSerStorage?.access_token: "" }`
    };

    return new HttpHeaders(config);
  }

  // public methods
  getFacturas(options:any = {}): Observable<FacturaDetalle[]> {
    let URL = FacturaURL

    if(Object.keys(options).length > 0){
      let URLOptions = `${FacturaURL}?`

      for (const key in options) {
        URLOptions += `${key}=${options[key]}&`
      }

      URL = URLOptions
    }

    return this.http.get<FacturaDetalle[]>(
      URL,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  getFacturaById(Id:number): Observable<FacturaDetalle> {
    const URL = `${FacturaURL}/${Id}`

    return this.http.get<FacturaDetalle>(
      URL,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  insertFacturaDetalle(data:any): Observable<any> {

    return this.http.post<any>(
      FacturaURL,
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  updateFacturaDetalle(Id:number,data:any): Observable<any> {
    const URL = `${FacturaURL}/${Id}`

    return this.http.put<any>(
      URL,
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  deleteFactura(id:number): Observable<any> {
    const URL = `${FacturaURL}/${id}`
    return this.http.delete(
      URL, {headers: this.headerJson_Token()}
    );
  }
}
