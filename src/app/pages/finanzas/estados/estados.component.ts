import { Component } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "app/auth/login/service/auth.service";
import { InversionResponse } from "app/shared/models/Inversion.model";
import {
  FiltrosList,
  Link,
  ListadoModel,
} from "app/shared/models/Listados.model";
import { FinanzasService } from "app/shared/services/finanzas.service";
import { HelpersService } from "app/shared/services/helpers.service";
import Swal from "sweetalert2";
import { ImportacionResponse } from "app/shared/models/Importacion.model";
type EstadoResponse = {
  ventas_listado: any;
  ventas_totalMetas: number;
  ventas_total: number;
  costo_listado: any;
  costo_total: number;
  utilidad_bruta_total: number;
  gasto_general_total: number;
  gasto_total: number;
  incentivos_total: number;
  incentivos_supervisor_total: number;
  utilidad_neta_total: number;
};

@Component({
  selector: "app-estados",
  templateUrl: "./estados.component.html",
  styleUrls: ["./estados.component.scss"],
})
export class EstadosComponent {
  dateIni: string;
  dateFin: string;
  allDates: boolean = false;
  listadoFilter: FiltrosList = {
    link: null,
    estado: 1,
    // disablePaginate: "true",
  };

  dataResponse: EstadoResponse;


  isLoad: boolean;

  constructor(
    public _FinanzasService: FinanzasService,
    public _AuthService: AuthService,
    private NgbModal: NgbModal,
    private _HelpersService: HelpersService
  ) {}

  ngOnInit(): void {
    this.setCurrentDate();
    this.asignarValores();
  }

  asignarValores() {
    this.isLoad = true;

    this._FinanzasService.getEstados(this.listadoFilter).subscribe(
      (EstadoResponse: EstadoResponse) => {
        console.log(EstadoResponse);
        this.dataResponse = { ...EstadoResponse };

        this.isLoad = false;
      },
      (error) => {
        this.isLoad = false;
      }
    );
    this.NgbModal.dismissAll();
  }

  openFiltros(content: any) {
    // console.log(this.mesNewMeta);
    this.listadoFilter.link = null;

    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
    }).result.then(
      (result) => {},
      (reason) => {}
    );
  }

  BuscarValor() {
    this.listadoFilter.link = null;
    this.asignarValores();
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
      allDates: this.allDates,
    };
  }

  limpiarFiltros() {
    this.setCurrentDate();
    this.allDates = true;

    this.asignarValores();
    this.NgbModal.dismissAll();
  }

  newPage(link: Link) {
    if (link.url == null) return;
    // console.log(link);

    this.listadoFilter.link = link.url;

    this.asignarValores();
  }

  
  descargarPDF() {
    Swal.fire({
      title: "Descargando el archivo",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    let bodyForm = {
      ...this.listadoFilter
    };
    this._FinanzasService
      .getEstadoFinanzaPDF(bodyForm)
      .subscribe((data) => {
        // console.log(data);
        this._HelpersService.downloadFile(
          data,
          `Estado_finanza_${this._HelpersService.changeformatDate(
            this._HelpersService.currentFullDay(),
            "MM/DD/YYYY HH:mm:ss",
            "DD-MM-YYYY_HH:mm:ss"
          )}`
        );
        Swal.fire("", "Descarga Completada", "success");
      });
  }
}
