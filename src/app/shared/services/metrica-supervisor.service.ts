import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MetricaSupervisorService {
  private baseUrl = "/api"; // ajustar según la API

  constructor(private http: HttpClient) {}

  // Métodos base para futuras métricas
  getResumen(params?: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/metricas/supervisor/resumen`, {
      params,
    });
  }
}
