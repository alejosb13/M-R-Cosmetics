import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

const ConfiguracionURL = `${environment.urlAPI}configuracion`

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

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

  migracion(userFrom:number,userTo:number): Observable<any> {

    return this.http.post(
      `${ConfiguracionURL}/migracion`,
      {
        userFrom,
        userTo
      },
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }
}
