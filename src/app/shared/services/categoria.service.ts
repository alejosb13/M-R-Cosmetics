import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Categoria } from '../models/Categoria.model';

const CategoriaURL = `${environment.urlAPI}categorias`

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  isLoad:boolean = false

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

  getCategoriaById(id:number): Observable<Categoria> { 

    return this.http.get<Categoria>(
      `${CategoriaURL}/${id}`, 
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }
  
  insertCategoria(data:any): Observable<any> { 

    return this.http.post(
      CategoriaURL, 
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }
  
  updateCategoria(id:number,data:any): Observable<any> { 

    return this.http.put(
      `${CategoriaURL}/${id}`, 
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  deleteCategoria(id:number): Observable<any> { 
    const URL = `${CategoriaURL}/${id}`
    return this.http.delete(
      URL, {headers: this.headerJson_Token()}
    );
  }
}
