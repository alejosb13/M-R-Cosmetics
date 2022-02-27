import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Cliente } from '../models/Cliente.model';


const ClienteURL = `${environment.urlAPI}cliente`

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  
  total:number = 0
  busqueda:string = ""
  datosTablaStorage:Cliente[] = []


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
  getCliente(): Observable<Cliente[]> { 

    return this.http.get<Cliente[]>(
      ClienteURL, 
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  getClienteById(Id:number): Observable<any> { 
    const URL = `${ClienteURL}/${Id}`
    
    return this.http.get(
      URL,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }
  
  insertCliente(data:Cliente): Observable<any> { 

    return this.http.post<Cliente>(
      ClienteURL, 
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }
  
  updateCliente(Id:number,data:Cliente): Observable<any> { 
    const URL = `${ClienteURL}/${Id}`
    
    return this.http.put<Cliente>(
      URL, 
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  deleteCliente(id:number): Observable<any> { 
    const URL = `${ClienteURL}/${id}`
    return this.http.delete(
      URL, {headers: this.headerJson_Token()}
    );
  }
}
