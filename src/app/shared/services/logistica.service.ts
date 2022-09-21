import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recibo } from '../models/Recibo.model';
import { environment } from 'environments/environment';
import { CarteraDate, CarteraDateBodyForm } from '../models/Logistica.model';
import { Cliente } from '../models/Cliente.model';

const Logistica = `${environment.urlAPI}logistica`

@Injectable({
  providedIn: 'root'
})
export class LogisticaService {
  constructor(
    private http: HttpClient
  ) { }

  headerJson_Token():HttpHeaders{
    // const DataUSerStorage = this.authService.getAuthFromLocalStorage()

    let config = {
      ContentType: 'application/json',
      // 'Authorization' : `bearer ${DataUSerStorage? DataUSerStorage?.access_token: "" }`
    };

    return new HttpHeaders(config);
  }

  // public methods
  getCarteraForDate(bodyform:CarteraDateBodyForm): Observable<CarteraDate> {

    return this.http.post<CarteraDate>(
      `${Logistica}/cartera-date`,
      bodyform,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  getRecuperacionForDate(bodyform:CarteraDateBodyForm): Observable<any> {

    return this.http.post<any>(
      `${Logistica}/recibo-date`,
      bodyform,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  getClientesInactivos(bodyform:CarteraDateBodyForm): Observable<any> {

    return this.http.post<any>(
      `${Logistica}/cliente-inactivo`,
      bodyform,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  getMora30A60(bodyform:CarteraDateBodyForm): Observable<CarteraDate> {

    return this.http.post<any>(
      `${Logistica}/mora-30-60`,
      bodyform,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  getClientesReactivados(bodyform:CarteraDateBodyForm): Observable<Cliente[]> {

    return this.http.post<any>(
      `${Logistica}/clientes-reactivados`,
      bodyform,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  getMora60A90(bodyform:CarteraDateBodyForm): Observable<CarteraDate> {

    return this.http.post<any>(
      `${Logistica}/mora-60-90`,
      bodyform,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  getclienteNew(bodyform:CarteraDateBodyForm): Observable<any> {

    return this.http.post<any>(
      `${Logistica}/cliente-new`,
      bodyform,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  getIncentivo(bodyform:CarteraDateBodyForm): Observable<any> {

    return this.http.post<any>(
      `${Logistica}/incentivo`,
      bodyform,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  getEstadoCuentaCliente(clienteData:any): Observable<any> {

    return this.http.post<any>(
      `${Logistica}/estado-de-cuenta`,
      clienteData,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  getProductoLogistica(): Observable<{"productos": number,"monto_total": number}> {

    return this.http.get<any>(
      `${Logistica}/producto-logistica`,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  getEstadoCuentaClientePDF(clienteId:any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.http.get(`${environment.urlAPI}pdf/estado_cuenta/${clienteId}`, { headers: headers, responseType: 'blob' });
  }

  carteraPDF(data:CarteraDateBodyForm): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.http.post(`${environment.urlAPI}pdf/cartera`,data, { headers: headers, responseType: 'blob' });
  }

  getMetaForDate(bodyform:CarteraDateBodyForm): Observable<any> {

    return this.http.post<any>(
      `${Logistica}/ventas`,
      bodyform,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  getRecuperacion(bodyform:{ userId: number}): Observable<any> {

    return this.http.post<any>(
      `${Logistica}/recuperacion`,
      bodyform,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }
}
