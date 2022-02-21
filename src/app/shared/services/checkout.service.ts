import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Factura } from '../models/Factura.model';
import { FacturaCheckout } from '../models/FacturaCheckout.model';
import { FacturaDetalle } from '../models/FacturaDetalle.model';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private authLocalStorageToken = `${environment.appVersion}-${environment.CHECKOUT_KEY_STORAGE}`;
  
  constructor(
    private http: HttpClient
  ) { }
    
  FacturaCheckout:FacturaCheckout = {} as FacturaCheckout;
  numeroProductos:BehaviorSubject<number> = new BehaviorSubject<number>(0)
  
  headerJson_Token():HttpHeaders{
    // const DataUSerStorage = this.authService.getAuthFromLocalStorage() 
    
    let config = {
      ContentType: 'application/json',
      // 'Authorization' : `bearer ${DataUSerStorage? DataUSerStorage?.access_token: "" }`
    };
    
    return new HttpHeaders(config);
  }
  
  
  set dataStorage(value:FacturaCheckout ){
    localStorage.setItem(this.authLocalStorageToken, JSON.stringify(value));
  }
  
  get dataStorage():FacturaCheckout{
    let  FacturaCheckout:FacturaCheckout = {} as FacturaCheckout;
    if(localStorage.getItem(this.authLocalStorageToken)){
      FacturaCheckout = JSON.parse(localStorage.getItem(this.authLocalStorageToken))
    }
    return FacturaCheckout
    // return localStorage.removeItem(this.authLocalStorageToken);
        
  }
  
  // public methods
  getCheckout(): any { 

    // return this.http.get(
    //   FacturaURL, 
    //   {headers: this.headerJson_Token(), responseType: "json" }
    // );
  }

  getProductCheckoutById(Id:number): any { 
    // const URL = `${FacturaURL}/${Id}`
    
    // return this.http.get(
    //   URL,
    //   {headers: this.headerJson_Token(), responseType: "json" }
    // );
  }
  
  getProductCheckout():FacturaDetalle[] { 
    const FacturaCheckout:FacturaCheckout = this.dataStorage
    let detalleProductos = []
    if(FacturaCheckout.factura_detalle){
      detalleProductos = [...FacturaCheckout.factura_detalle]
    }
    
    return detalleProductos
  }
  
  insertCheckout(data:Factura){ 

    // return this.http.post<Factura>(
    //   FacturaURL, 
    //   data,
    //   {headers: this.headerJson_Token(), responseType: "json" }
    // );
  }
  
  updateCheckout(Id:number,data:Factura) { 
    // const URL = `${FacturaURL}/${Id}`
    
    // return this.http.put<Factura>(
    //   URL, 
    //   data,
    //   {headers: this.headerJson_Token(), responseType: "json" }
    // );
  }

  deleteProductCheckout(id:number) { 
    // const URL = `${FacturaURL}/${id}`
    // return this.http.delete(
    //   URL, {headers: this.headerJson_Token()}
    // );
  }
}
