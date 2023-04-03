import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Frecuencia } from '../models/Frecuencia.model';

const FrecuenciaURL = `${environment.urlAPI}frecuencias`
@Injectable({
  providedIn: 'root'
})
export class FrecuenciaService {
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
  getFrecuencia(): Observable<Frecuencia[]> { 

    return this.http.get<Frecuencia[]>(
      FrecuenciaURL, 
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  getFrecuenciaById(id:number): Observable<Frecuencia> { 

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
