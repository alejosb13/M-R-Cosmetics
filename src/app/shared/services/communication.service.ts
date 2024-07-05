import { EventEmitter, Injectable } from "@angular/core";
import { environment } from "@environment/environment";
import { BehaviorSubject, Subscription } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CommunicationService {
  ReiniciarInsertarAbonoForm: EventEmitter<boolean> = new EventEmitter(false);
  BottonAgregarAbonoActive: EventEmitter<boolean> = new EventEmitter(false);
  RefreshList: EventEmitter<boolean> = new EventEmitter(false);
  // DeleteReferralSource: EventEmitter<any> = new EventEmitter();
  // DeleteDOL: EventEmitter<any> = new EventEmitter();
  // DeletePatient: EventEmitter<any> = new EventEmitter();
  // DeleteMedicalProvider: EventEmitter<any> = new EventEmitter();
  // DeleteMedicalBranchProvider: EventEmitter<any> = new EventEmitter();
  // DeleteAttorneyBranchProvider: EventEmitter<any> = new EventEmitter();
  // DeleteAttorneyContactProvider: EventEmitter<any> = new EventEmitter();
  // DeleteMarketer: EventEmitter<any> = new EventEmitter();
  // InactiveUser: EventEmitter<any> = new EventEmitter();
  // FileModification: EventEmitter<any> = new EventEmitter();
  // LoginPage: EventEmitter<any> = new EventEmitter();

  private storageKey = `${environment.USERDATA_KEY_STORAGE}Theme`;
  private themeSubject: BehaviorSubject<any>;

  constructor() {
    const savedTheme = this.getStoredTheme();
    this.themeSubject = new BehaviorSubject<any>(savedTheme);
  }

  // Guardar tema en localStorage y notificar a los suscriptores
  setTheme(value: any): void {
    const jsonValue = JSON.stringify(value);
    localStorage.setItem(this.storageKey, jsonValue);
    this.themeSubject.next(value);
  }

  // Obtener tema como Observable
  getTheme() {
    return this.themeSubject.asObservable();
  }

  // Eliminar tema de localStorage y notificar a los suscriptores
  removeTheme(): void {
    localStorage.removeItem(this.storageKey);
    this.themeSubject.next(null);
  }

  // Obtener tema almacenado desde localStorage
  private getStoredTheme(): any {
    const jsonValue = localStorage.getItem(this.storageKey);
    if (jsonValue) {
      return JSON.parse(jsonValue);
    }
    return null;
  }

  getThemeWithoutSubscription(): any {
    return this.themeSubject.getValue();
  }
}
