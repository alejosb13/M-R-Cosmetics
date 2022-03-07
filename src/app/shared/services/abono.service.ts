import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Abono } from '../models/Abono.model';

const AbonoURL = `${environment.urlAPI}abonos`


@Injectable({
  providedIn: 'root'
})
export class AbonoService {

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
  getAbono(): Observable<Abono[]> { 

    return this.http.get<Abono[]>(
      AbonoURL, 
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  getAbonoById(Id:number): Observable<any> { 
    const URL = `${AbonoURL}/${Id}`
    
    return this.http.get(
      URL,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }
  
  insertAbono(data:Abono): Observable<any> { 

    return this.http.post<Abono>(
      AbonoURL, 
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }
  
  updateAbono(Id:number,data:Abono): Observable<any> { 
    const URL = `${AbonoURL}/${Id}`
    
    return this.http.put<Abono>(
      URL, 
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  deleteAbono(id:number): Observable<any> { 
    const URL = `${AbonoURL}/${id}`
    return this.http.delete(
      URL, {headers: this.headerJson_Token()}
    );
  }
}
