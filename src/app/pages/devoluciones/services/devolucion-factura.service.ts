import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DevolucionProducto } from 'app/shared/models/DevolucionProducto.model';

const DevolucionFActuraURL = `${environment.urlAPI}devolucion-factura`
@Injectable({
  providedIn: 'root'
})
export class DevolucionFacturaService {
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
    let URL = DevolucionFActuraURL

    if(Object.keys(options).length > 0){
      let URLOptions = `${DevolucionFActuraURL}?`

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
    const URL = `${DevolucionFActuraURL}/${Id}`

    return this.http.get<DevolucionProducto>(
      URL,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  insertDevolucion(data:any): Observable<any> {

    return this.http.post<any>(
      DevolucionFActuraURL,
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  updateDevolucion(Id:number,data:DevolucionProducto): Observable<any> {
    const URL = `${DevolucionFActuraURL}/${Id}`

    return this.http.put<DevolucionProducto>(
      URL,
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  deleteDevolucion(id:number): Observable<any> {
    const URL = `${DevolucionFActuraURL}/${id}`
    return this.http.delete(
      URL, {headers: this.headerJson_Token()}
    );
  }



}
