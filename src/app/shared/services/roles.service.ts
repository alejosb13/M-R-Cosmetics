import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Role } from '../models/Role.model';

const RolesURL = `${environment.urlAPI}roles`

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(
    private http: HttpClient
  ) {}
  
  headerJson_Token():HttpHeaders{
    // const DataUSerStorage = this.authService.getAuthFromLocalStorage() 
    
    let config = {
      'Content-Type': 'application/json',
      // 'Authorization' : `bearer ${DataUSerStorage? DataUSerStorage?.access_token: "" }`
    };
    
    return new HttpHeaders(config);
  }
  
  // public methods
  getRole(): Observable<any> { 

    return this.http.get(
      RolesURL, 
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  getRoleById(Id:number): Observable<any> { 
    const URL = `${RolesURL}/${Id}`
    
    return this.http.get(
      URL,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }
  
  insertRole(data:Role): Observable<any> { 

    return this.http.post<Role>(
      RolesURL, 
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }
  
  updateRole(Id:number,data:Role): Observable<any> { 
    const URL = `${RolesURL}/${Id}`
    
    return this.http.put<Role>(
      URL, 
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  deleteRole(id:number): Observable<any> { 
    const URL = `${RolesURL}/${id}`
    return this.http.delete(
      URL, {headers: this.headerJson_Token()}
    );
  }
}
