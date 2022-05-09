import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recibo } from '../models/Recibo.model';
import { environment } from 'environments/environment';
import { CarteraDate, CarteraDateBodyForm } from '../models/Logistica.model';

const Logistica = `${environment.urlAPI}logistica`

@Injectable({
  providedIn: 'root'
})
export class LogisticaService {
  constructor(
    private http: HttpClient
  ) { }

  headerJson_Token():HttpHeaders{
    // const DataUSerStorage = this.authService.getAuthFromLocalStorage()

    let config = {
      ContentType: 'application/json',
      // 'Authorization' : `bearer ${DataUSerStorage? DataUSerStorage?.access_token: "" }`
    };

    return new HttpHeaders(config);
  }

  // public methods
  getCarteraForDate(bodyform:CarteraDateBodyForm): Observable<CarteraDate> {

    return this.http.post<CarteraDate>(
      `${Logistica}/cartera-date`,
      bodyform,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }


}
