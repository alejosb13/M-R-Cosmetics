import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Categoria } from 'app/shared/models/Categoria.model';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY_STORAGE}`;
  
  constructor(
    private http: HttpClient
  ) {}
  
  private headerJson_Token():HttpHeaders{
    const DataUSerStorage = this.dataStorage 
    
    let config = {
      ContentType: 'application/json',
      // 'Authorization' : `bearer ${DataUSerStorage? DataUSerStorage?.access_token: "" }`
    };
    
    return new HttpHeaders(config);
  }

  login(email:string,password:string): Observable<any> {
    const URL = `${environment.urlAPI}signin`
    let data = {
      email,
      password
    }
    
    return this.http.post(
      URL,
      data, 
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }
  
  logout() {
    const URL = `${environment.urlAPI}sign-out`
    return this.http.post(
      URL,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }  

  set dataStorage(value:any ){
    localStorage.setItem(this.authLocalStorageToken, JSON.stringify(value));
  }
  
  get dataStorage(){
    return localStorage.get(this.authLocalStorageToken);
    // return localStorage.removeItem(this.authLocalStorageToken);
        
  }
}
