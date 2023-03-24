import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "app/auth/login/service/auth.service";
import { CarteraDateBodyForm } from "app/shared/models/Logistica.model";
import { HelpersService } from "app/shared/services/helpers.service";
import { LogisticaService } from "app/shared/services/logistica.service";

@Component({
  selector: "dashboard-cmp",
  moduleId: module.id,
  templateUrl: "dashboard.component.html",
  styleUrls: ["dashboard.component.css"],
})
export class DashboardComponent implements OnInit {

  public isAdmin:boolean;
  public isSupervisor:boolean;
  public userId: number;
  public recuperacionPorcentaje: number;

  //filtros
  public filtros: any = {};
  public dateIni: string;
  public dateFin: string;

  constructor(
    private _AuthService: AuthService,
    // private _LogisticaService: LogisticaService,
  ) {}

  ngOnInit() {
    this.userId = Number(this._AuthService.dataStorage.user.userId);
    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor();
  }


}
