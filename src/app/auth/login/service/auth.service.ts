import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Categoria } from 'app/shared/models/Categoria.model';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Auth } from '../models/auth.model';

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
  
  isLogin(): boolean{
    if(!this.dataStorage) return false
    if(!this.dataStorage.token ){
      return false
    }
    
    return this.dataStorage.token != ""? true : false;
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
  deleteSession(){
    localStorage.removeItem(this.authLocalStorageToken)
  }
  
  validarRol(roleName:string):boolean{
    if(roleName.includes(",")){
      let arrayRole:string[] = roleName.split(',')
      if(this.dataStorage) return arrayRole.includes(this.dataStorage.user.roleName)
      
    }else{
      return this.dataStorage.user.roleName.includes(roleName)
    }
    
    return false
  }

  set dataStorage(value:Auth ){
    localStorage.setItem(this.authLocalStorageToken, JSON.stringify(value));
  }
  
  get dataStorage():Auth{
    let auth:Auth = JSON.parse(localStorage.getItem(this.authLocalStorageToken));
    
    if(auth){
      return auth;
    }
    // return localStorage.getItem(this.authLocalStorageToken);
    // return localStorage.removeItem(this.authLocalStorageToken);
        
  }
}
