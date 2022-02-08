import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Categoria } from '../models/Categoria.models';

const CategoriaURL = `${environment.urlAPI}categorias`

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

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
  getCategoria(): Observable<Categoria[]> { 

    return this.http.get<Categoria[]>(
      CategoriaURL, 
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }
  
  insertCliente(id:number,data:any): Observable<any> { 

    return this.http.post(
      CategoriaURL, 
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }
  
  updateCliente(id:number,data:any): Observable<any> { 

    return this.http.put(
      CategoriaURL, 
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  deleteCliente(id:number): Observable<any> { 
    const URL = `${CategoriaURL}/${id}`
    return this.http.delete(
      URL, {headers: this.headerJson_Token()}
    );
  }
}
