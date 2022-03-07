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
}
