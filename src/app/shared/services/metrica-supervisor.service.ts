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
  getMetricaSupervisor(params?: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/supervisor/metricas`, {
      ...params,
    });
  }

  // Actualizar meta de clientes
  updateMetaCliente(data: { user_id: number; cliente_meta: number; dateIni: string; dateFin: string }): Observable<any> {
    return this.http.post(`${environment.urlAPI}supervisor/meta-cliente`, data);
  }

  // Actualizar monto de reactivación de clientes
  updateMontoReactivacion(data: { monto: number; fecha: string }): Observable<any> {
    return this.http.post(`${environment.urlAPI}supervisor/monto-condicion-reactivados`, data);
  }
}
