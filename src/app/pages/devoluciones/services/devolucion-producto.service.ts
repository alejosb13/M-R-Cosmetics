import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DevolucionProducto } from 'app/shared/models/DevolucionProducto.model';

const DevolucionProductoURL = `${environment.urlAPI}devoluciones-producto`

@Injectable({
  providedIn: 'root'
})
export class DevolucionProductoService {
  constructor(
    private http: HttpClient
  ) {}


  headerJson_Token():HttpHeaders{
    // const DataUSerStorage = this.authService.getAuthFromLocalStorage()

    let config = {
      ContentType: 'application/json',
      // 'Authorization' : `bearer ${DataUSerStorage? DataUSerStorage?.access_token: "" }`
    };

    return new HttpHeaders(config);
  }

  // public methods
  getProductosDevueltos(options:any = {}): Observable<DevolucionProducto[]> {
    let URL = DevolucionProductoURL

    if(Object.keys(options).length > 0){
      let URLOptions = `${DevolucionProductoURL}?`

      for (const key in options) {
        URLOptions += `${key}=${options[key]}&`
      }

      URL = URLOptions
    }
    return this.http.get<DevolucionProducto[]>(
      URL,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  getProductoDevueltoId(Id:number): Observable<DevolucionProducto> {
    const URL = `${DevolucionProductoURL}/${Id}`

    return this.http.get<DevolucionProducto>(
      URL,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  insertDevolucion(data:DevolucionProducto): Observable<any> {

    return this.http.post<DevolucionProducto>(
      DevolucionProductoURL,
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  updateDevolucion(Id:number,data:DevolucionProducto): Observable<any> {
    const URL = `${DevolucionProductoURL}/${Id}`

    return this.http.put<DevolucionProducto>(
      URL,
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  deleteDevolucion(id:number): Observable<any> {
    const URL = `${DevolucionProductoURL}/${id}`
    return this.http.delete(
      URL, {headers: this.headerJson_Token()}
    );
  }



}
