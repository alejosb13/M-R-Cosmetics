import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Producto } from '../models/Producto.model';

const ProductoURL = `${environment.urlAPI}productos`

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  
  // private productoStorage:Producto
  IsLoad:boolean = false
  
  constructor(
    private http: HttpClient
  ) { }
  
  // get producto():Producto{
  //   return this.productoStorage
  // }
  
  // set producto(value:Producto){
  //   this.productoStorage = value
  // }
  
  headerJson_Token():HttpHeaders{
    // const DataUSerStorage = this.authService.getAuthFromLocalStorage() 
    
    let config = {
      'Content-Type': 'application/json',
      // 'Authorization' : `bearer ${DataUSerStorage? DataUSerStorage?.access_token: "" }`
    };
    
    return new HttpHeaders(config);
  }
  
  // public methods
  getProducto(): Observable<Producto[]> { 

    return this.http.get<Producto[]>(
      ProductoURL, 
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  getProductoById(Id:number): Observable<any> { 
    const URL = `${ProductoURL}/${Id}`
    
    return this.http.get(
      URL,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }
  
  insertProducto(data:Producto): Observable<any> { 

    return this.http.post<Producto>(
      ProductoURL, 
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }
  
  updateProducto(Id:number,data:Producto): Observable<any> { 
    const URL = `${ProductoURL}/${Id}`
    
    return this.http.put<Producto>(
      URL, 
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  deleteProducto(id:number): Observable<any> { 
    const URL = `${ProductoURL}/${id}`
    return this.http.delete(
      URL, {headers: this.headerJson_Token()}
    );
  }

  inventario(): Observable<any> { 
    const URL = `${environment.urlAPI}pdf/productos/inventario`

    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    return this.http.get(URL, { headers: headers, responseType: 'blob' });

  }
}
