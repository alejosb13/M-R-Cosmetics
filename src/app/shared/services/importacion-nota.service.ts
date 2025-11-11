import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";

const FinanzasURL = `${environment.urlAPI}finanzas`;

@Injectable({
  providedIn: "root",
})
export class ImportacionNotaService {
  constructor(private http: HttpClient) {}

  headerJson_Token(): HttpHeaders {
    let config = {
      "Content-Type": "application/json",
    };

    return new HttpHeaders(config);
  }

  /**
   * Crea una nota para una importación.
   * payload esperado: { importacion_id: number, valor: number }
   */
  createNota(importacionId: number, valor: number): Observable<any> {
    const payload = {
      importacion_id: importacionId,
      monto: valor,
    };

    return this.http.post(`${FinanzasURL}/importacion-notas`, payload, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }
}
