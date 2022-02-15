import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Usuario, UsuarioServ } from '../models/Usuario.model';

const UsuarioURL = `${environment.urlAPI}usuarios`

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
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
  getUsuario(): Observable<any> { 

    return this.http.get(
      UsuarioURL, 
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  getUsuarioById(Id:number): Observable<any> { 
    const URL = `${UsuarioURL}/${Id}`
    
    return this.http.get(
      URL,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }
  
  insertUsuario(data:UsuarioServ): Observable<any> { 

    return this.http.post<Usuario>(
      UsuarioURL, 
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }
  
  updateUsuario(Id:number,data:UsuarioServ): Observable<any> { 
    const URL = `${UsuarioURL}/${Id}`
    
    return this.http.put<Usuario>(
      URL, 
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  deleteUsuario(id:number): Observable<any> { 
    const URL = `${UsuarioURL}/${id}`
    return this.http.delete(
      URL, {headers: this.headerJson_Token()}
    );
  }
}