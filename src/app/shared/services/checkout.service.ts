import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Factura } from '../models/Factura.model';
import { FacturaCheckout } from '../models/FacturaCheckout.model';
import { FacturaDetalle } from '../models/FacturaDetalle.model';
import { Producto } from '../models/Producto.model';

const FacturaURL = `${environment.urlAPI}facturas`
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
  
  
  private calcularMontoTotal(Factura:FacturaCheckout):number{
    let monto:number = 0
    if(Factura.factura_detalle.length >0){
      let precios = Factura.factura_detalle.map((producto => producto.precio))
      
      monto = precios.reduce((valorAnterior, valor) => valorAnterior + valor)
    }
    
    return monto
  }
  
  private set dataStorage(value:FacturaCheckout ){
    localStorage.setItem(this.authLocalStorageToken, JSON.stringify(value));
  }
  
  private get dataStorage():FacturaCheckout{
    let  FacturaCheckout:FacturaCheckout = {} as FacturaCheckout;
    if(localStorage.getItem(this.authLocalStorageToken)){
      FacturaCheckout = JSON.parse(localStorage.getItem(this.authLocalStorageToken))
    }
    return FacturaCheckout
  }
  
 
  
  getProductCheckoutById(Id:number): any { }
  
  getProductCheckout():FacturaDetalle[] { 
    const FacturaCheckout:FacturaCheckout = this.dataStorage
    let detalleProductos = []
    if(FacturaCheckout.factura_detalle){
      detalleProductos = [...FacturaCheckout.factura_detalle]
    }
    
    return detalleProductos
  }
  
  getCheckout():FacturaCheckout{
    return this.dataStorage
  }
   
  // insertCheckout(data:Factura){ 
    
  // }
  
  // updateCheckout(Id:number,data:Factura) { }

  addProductCheckout(producto:Producto) { 
    let factura_detalle:FacturaDetalle ={
      producto_id: producto.id,
      cantidad: producto.stock,
      precio: producto.precio,
      nombre: `${producto.modelo} - ${producto.marca}`,
      descripcion: producto.descripcion,
      porcentaje: 0,
      // comision: producto.comision,
    }
    
    let FacturaCheckout: FacturaCheckout = {...this.dataStorage}
    FacturaCheckout.factura_detalle = (FacturaCheckout.factura_detalle)? [...FacturaCheckout.factura_detalle, factura_detalle ]: [factura_detalle]
    FacturaCheckout.monto = this.calcularMontoTotal(FacturaCheckout)
    
    this.CheckoutToStorage(FacturaCheckout)
  }
  
  deleteProductCheckout(item:FacturaDetalle) { 
    
    let Factura:FacturaCheckout = {...this.dataStorage}
    Factura.factura_detalle = Factura.factura_detalle.filter((producto:FacturaDetalle)=> producto.producto_id == item.id && producto.cantidad == item.cantidad)
    Factura.monto = this.calcularMontoTotal(Factura)
    
    this.CheckoutToStorage(Factura)
  }
  
  CheckoutToStorage(Factura:FacturaCheckout){
    this.dataStorage = Factura
  }

  insertFactura(data:FacturaCheckout): Observable<any>{
    return this.http.post<Factura>(
      FacturaURL, 
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }
  
}
