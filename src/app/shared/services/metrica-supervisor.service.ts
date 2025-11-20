import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@environment/environment";

@Injectable({
  providedIn: "root",
})
export class MetricaSupervisorService {
  private baseUrl = `${environment.urlAPI}logistica`; // ajustar según la API
  constructor(private http: HttpClient) {}

  // Métodos base para futuras métricas
  getVentasSupervisor(params?: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/cliente-new-supervisor`, {
      params,
    });
  }
}
