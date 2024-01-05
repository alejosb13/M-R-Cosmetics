import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of, from } from "rxjs";
import { environment } from "environments/environment";
import { Regalo, RegaloFacturado } from '../models/Regalo';
import { Producto } from "../models/Producto.model";
import { FacturaDetalle } from '../models/FacturaDetalle.model';

const REGALOURL = `${environment.urlAPI}regalos`;

@Injectable({
  providedIn: "root",
})
export class RegaloService {
  constructor(private http: HttpClient) {}

  headerJson_Token(): HttpHeaders {
    // const DataUSerStorage = this.authService.getAuthFromLocalStorage()

    let config = {
      'Content-Type': "application/json",
      // 'Authorization' : `bearer ${DataUSerStorage? DataUSerStorage?.access_token: "" }`
    };

    return new HttpHeaders(config);
  }

  // public methods
  getRegalosXProducto(id: number): Observable<Regalo[]> {
    return this.http.get<Regalo[]>(`${REGALOURL}/${id}`, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  getRegalosXdetalleFactura(id: number): Observable<FacturaDetalle> {
    return this.http.get<FacturaDetalle>(`${REGALOURL}/detalle/${id}`, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  setRegalo(regalo: Producto, producto_id: number): Observable<any> {
    return this.http.post<Regalo[]>(
      `${REGALOURL}`,
      {
        producto_id: producto_id,
        cantidad: regalo.stock,
        id_producto_regalo: regalo.id,
      },
      { headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  deleteRegalo(id: number): Observable<any> {
    const URL = `${REGALOURL}/${id}`;
    return this.http.delete(URL, { headers: this.headerJson_Token() });
  }

  updateRegalo(cantidad: number, id: number): Observable<any> {
    const URL = `${REGALOURL}/${id}`;
    return this.http.patch(
      URL,
      {
        cantidad,
        id,
      },
      { headers: this.headerJson_Token() }
    );
  }
}
