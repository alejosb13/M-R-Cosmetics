import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "app/auth/login/service/auth.service";
import { Factura } from "app/shared/models/Factura.model";
import { FiltrosList } from "app/shared/models/Listados.model";
import { HelpersService } from "app/shared/services/helpers.service";
import { LogisticaService } from "app/shared/services/logistica.service";
import logger from "app/shared/utils/logger";
import { map } from "rxjs/operators";

@Component({
  selector: "dashboard-cmp",
  moduleId: module.id,
  templateUrl: "dashboard.component.html",
  styleUrls: ["dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  public isLoad: boolean;

  public isAdmin: boolean;
  public isSupervisor: boolean;
  public userId: number;
  public recuperacionPorcentaje: number;

  //filtros
  public filtros: any = {};
  public dateIni: string;
  public dateFin: string;

  listadoFilter: FiltrosList = {
    link: null,
    allUsers: false,
    status_pagado: 0,
    allNumber: true,
    allDates: false,
  };

  public response: any = {};

  constructor(
    private _AuthService: AuthService,
    private _HelpersService: HelpersService,
    private _LogisticaService: LogisticaService
  ) {}

  ngOnInit() {
    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor();

    this.listadoFilter.userId = Number(
      this._AuthService.dataStorage.user.userId
    );
    this.setCurrentDate();
    
    this.getResumen();
    // if (this.isAdmin || this.isSupervisor) {
    //   this.getResumenAdmin();
    // } else {
    // }
  }

  setCurrentDate() {
    let current = this._HelpersService.changeformatDate(
      this._HelpersService.currentDay(),
      "MM/DD/YYYY",
      "YYYY-MM-DD"
    );
    let month = this._HelpersService.changeformatDate(
      this._HelpersService.currentDay(),
      "MM/DD/YYYY",
      "MM"
    );
    let year = this._HelpersService.changeformatDate(
      this._HelpersService.currentDay(),
      "MM/DD/YYYY",
      "YYYY"
    );
    let rangoMonth = this._HelpersService.InicioYFinDeMes(current);

    this.dateIni = `${year}-${month}-01`;
    this.dateFin = `${year}-${month}-${rangoMonth.ultimoDiaDelMes}`;

    this.listadoFilter = {
      ...this.listadoFilter,
      dateIni: this.dateIni,
      dateFin: this.dateFin,
    };
  }

  getResumen() {
    this.isLoad = true;

    this._LogisticaService
      .getDashboard(this.listadoFilter.userId)
      // .pipe(
      //   map((response) => {
      //     response.mora30_60 = this.calcularTotalSaldo(
      //       response.mora30_60.factura
      //     );
      //     response.mora60_90 = this.calcularTotalSaldo(
      //       response.mora60_90.factura
      //     );
      //     return response;
      //   })
      // )
      .subscribe(
        (response) => {
          // logger.log("🚀 ~ respoanse:", response);
          this.response = response;
        },
        () => {},
        () => {
          this.isLoad = false;
        }
      );
  }

  getResumenAdmin() {
    this.isLoad = true;
    console.log("admin");

    this._LogisticaService
      .getDashboardAdmin(this.listadoFilter)
      .pipe(
        map((response) => {
          response.mora30_60 = this.calcularTotalSaldo(
            response.mora30_60.factura
          );
          response.mora60_90 = this.calcularTotalSaldo(
            response.mora60_90.factura
          );
          return response;
        })
      )
      .subscribe(
        (response) => {
          // logger.log("🚀 ~ respoanse:", response);
          this.response = response;
        },
        () => {},
        () => {
          this.isLoad = false;
        }
      );
  }

  calcularTotalSaldo(facturas: Factura[]) {
    let total = 0;

    // console.log("🚀 ~ file: dashboard.component.ts:124 ~ DashboardComponent ~ total:", facturas)
    if (facturas.length > 0) {
      let totalIncentivo = facturas.map(
        (factura: Factura) => factura.saldo_restante
      );

      total = totalIncentivo.reduce(
        (accumulator: number, currentValue: number) =>
          accumulator + currentValue,
        total
      );
    }

    return total;
  }
}
