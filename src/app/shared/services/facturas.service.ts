import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Factura } from '../models/Factura.model';
import { FacturaCheckout } from '../models/FacturaCheckout.model';

const FacturaURL = `${environment.urlAPI}facturas`

@Injectable({
  providedIn: 'root'
})
export class FacturasService {
  constructor(
    private http: HttpClient
  ) { }

  FacturaCheckout:FacturaCheckout = {} as FacturaCheckout;

  headerJson_Token():HttpHeaders{
    // const DataUSerStorage = this.authService.getAuthFromLocalStorage()

    let config = {
      ContentType: 'application/json',
      // 'Authorization' : `bearer ${DataUSerStorage? DataUSerStorage?.access_token: "" }`
    };

    return new HttpHeaders(config);
  }

  // public methods
  getFacturas(options:any = {}): Observable<Factura[]> {
    let URL = FacturaURL

    if(Object.keys(options).length > 0){
      let URLOptions = `${FacturaURL}?`

      for (const key in options) {
        URLOptions += `${key}=${options[key]}&`
      }

      URL = URLOptions
    }

    return this.http.get<Factura[]>(
      URL,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  getFacturaById(Id:number): Observable<Factura> {
    const URL = `${FacturaURL}/${Id}`

    return this.http.get<Factura>(
      URL,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  insertFactura(data:Factura): Observable<any> {

    return this.http.post<Factura>(
      FacturaURL,
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  FacturaPDF(id:number): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.http.get(`${environment.urlAPI}pdf/${id}`, { headers: headers, responseType: 'blob' });

    // return this.http.get<any>(
    //   // `${FacturaURL}/pdf`,
    //   `http://127.0.0.1:8000/api/pdf/1`,
    //   // data,
    //   {headers: this.headerJson_Token(), }
    // );
  }

  updateFactura(Id:number,data:Factura): Observable<any> {
    const URL = `${FacturaURL}/${Id}`

    return this.http.put<Factura>(
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

  despacharFactura(id:number,data:any): Observable<any> {
    const URL = `${FacturaURL}/despachar/${id}`
    return this.http.put(
      URL,
      data,
      {headers: this.headerJson_Token()}
    );
  }

  entregarFactura(id:number): Observable<any> {
    const URL = `${FacturaURL}/entregada/${id}`
    return this.http.put(
      URL,
      {headers: this.headerJson_Token()}
    );
  }
}
