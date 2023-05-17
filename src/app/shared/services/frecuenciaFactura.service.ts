import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Frecuencia } from '../models/Frecuencia.model';
import { FrecuenciaFactura } from '../models/FrecuenciaFactura.model';

const FrecuenciaURL = `${environment.urlAPI}frecuencias-factura`
@Injectable({
  providedIn: 'root'
})
export class FrecuenciaFacturaService {
  isLoad:boolean = false;

  constructor(
    private http: HttpClient
  ) {}

    
  private headerJson_Token():HttpHeaders{
    // const DataUSerStorage = this.authService.getAuthFromLocalStorage() 
    
    let config = {
      ContentType: 'application/json',
      // 'Authorization' : `bearer ${DataUSerStorage? DataUSerStorage?.access_token: "" }`
    };
    
    return new HttpHeaders(config);
  }

  // public methods
  getFrecuencia(): Observable<FrecuenciaFactura[]> { 

    return this.http.get<Frecuencia[]>(
      FrecuenciaURL, 
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  getFrecuenciaById(id:number): Observable<FrecuenciaFactura> { 

    return this.http.get<Frecuencia>(
      `${FrecuenciaURL}/${id}`, 
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }
  
  insertFrecuencia(data:any): Observable<any> { 

    return this.http.post(
      FrecuenciaURL, 
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }
  
  updateFrecuencia(id:number,data:any): Observable<any> { 

    return this.http.put(
      `${FrecuenciaURL}/${id}`, 
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  deleteFrecuencia(id:number): Observable<any> { 
    const URL = `${FrecuenciaURL}/${id}`
    return this.http.delete(
      URL, {headers: this.headerJson_Token()}
    );
  }
}
