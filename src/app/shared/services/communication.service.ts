import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
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
  constructor() { }
}
