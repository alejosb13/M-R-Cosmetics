import { Component, OnInit } from "@angular/core";
import { CommunicationService } from "@app/shared/services/communication.service";
import { Listado } from "@app/shared/services/listados.service";
import { abreviarNombre } from "@app/shared/utils/helpers";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "app/auth/login/service/auth.service";
import { TypesFiltersForm } from "app/shared/models/FiltersForm";
import { CarteraDateBodyForm } from "app/shared/models/Logistica.model";
import { Usuario } from "app/shared/models/Usuario.model";
import { HelpersService } from "app/shared/services/helpers.service";
import { LogisticaService } from "app/shared/services/logistica.service";
import { RememberFiltersService } from "app/shared/services/remember-filters.service";
import { TablasService } from "app/shared/services/tablas.service";
import { UsuariosService } from "app/shared/services/usuarios.service";
import logger from "app/shared/utils/logger";
import { ChartType } from "chart.js";
import { environment } from "environments/environment";
import * as moment from "moment";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
type Recuperacion = {
  facturasTotal: number;
  abonosTotal: number;
  abonosTotalLastMount: number;
  recuperacionPorcentaje: number;
  recuperacionTotal: number;
  user_id: number;
  user: Usuario;
};

@Component({
  selector: "app-recuperacion-anual",
  templateUrl: "./recuperacion-anual.component.html",
  styleUrls: ["./recuperacion-anual.component.scss"],
})
export class RecuperacionAnualComponent {
  page = 1;
  pageSize = environment.PageSize;
  collectionSize = 0;

  filtros: any = {};
  dateIni: string;
  dateFin: string;

  isLoad: boolean = false;

  isAdmin: boolean;
  isSupervisor: boolean;

  USersNames: string[] = [];
  userId: number;
  userIdString: string;
  userStore: Usuario[];

  Data: Recuperacion[];

  FilterSection: TypesFiltersForm = "recuperacionAnualFilter";

  totalAbonos: number;
  totalMetas: number;
  recuperacionPorcentaje: number | string;
  themeSite: string;
  themeSubscription: Subscription;

  public barChartLabels: string[] = [];
  public barChartData: any[] = [];
  public barChartType: ChartType = "bar";
  public barChartOptions: any = {
    responsive: true,
    scales: {
      yAxes: [{ ticks: { beginAtZero: true } }],
    },
    legend: { display: true },
  };

  public porcentajeLabels: string[] = [];
  public porcentajeData: any[] = [];
  public porcentajeChartType: ChartType = "bar";
  public porcentajeOptions: any = {
    responsive: true,
    scales: {
      yAxes: [{ ticks: { beginAtZero: true } }],
    },
    legend: { display: true },
  };

  constructor(
    private _CommunicationService: CommunicationService,
    private _TablasService: TablasService,
    private _AuthService: AuthService,
    private _LogisticaService: LogisticaService,
    private NgbModal: NgbModal,
    private _HelpersService: HelpersService,
    private _UsuariosService: UsuariosService,
    private _RememberFiltersService: RememberFiltersService,
    private _Listado: Listado
  ) {}

  ngOnInit(): void {
    this.isLoad = true;

    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor();
    this.userId = Number(this._AuthService.dataStorage.user.userId);

    if (this.isAdmin || this.isSupervisor) {
      this.getUsers();
    }

    // this.setCurrentDate();
    this.aplicarFiltros();
    // this.asignarValores()

    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
  }

  getUsers() {
    this._Listado
      .UsuariosList({
        disablePaginate: 1,
        estado: 1,
        // factura: 1,
        // recibo: 1,
        // recibosRangosSinTerminar: 1,
      })
      .subscribe((usuarios: Usuario[]) => {
        this.userStore = usuarios;
        this.USersNames = usuarios.map(
          (usuario) => `${usuario.id} - ${usuario.name} ${usuario.apellido}`
        );

        // this.resetUser()
      });
  }

  aplicarFiltros(submit: boolean = false) {
    let filtrosStorage = this._RememberFiltersService.getFilterStorage();

    if (filtrosStorage.hasOwnProperty(this.FilterSection) && !submit) {
      this.filtros = { ...filtrosStorage[this.FilterSection] };

      this.dateIni = this.filtros.dateIni;
      this.dateFin = this.filtros.dateFin;
      this.userId = Number(this.filtros.userId);
    } else {
      if (!submit) {
        this.userId = Number(this._AuthService.dataStorage.user.userId);
      }

      if (!this.dateIni || !this.dateFin) this.setCurrentDate(); // si las fechas estan vacias, se setean las fechas men actual

      if (
        this._HelpersService.siUnaFechaEsIgualOAnterior(
          this.dateIni,
          this.dateFin
        )
      )
        this.setCurrentDate(); // si las fecha inicial es mayor a la final, se setean las fechas mes actual

      this.filtros = {
        dateIni: this.dateIni,
        dateFin: this.dateFin,
        userId: Number(this.userId),
      };
    }

    this._RememberFiltersService.setFilterStorage(this.FilterSection, {
      ...this.filtros,
    });
    this.asignarValores();
    this.NgbModal.dismissAll();
  }

  setCurrentDate() {
    // let current = this._HelpersService.changeformatDate(
    //   this._HelpersService.currentDay(),
    //   "MM/DD/YYYY",
    //   "YYYY-MM-DD"
    // );
    // let month = this._HelpersService.changeformatDate(
    //   this._HelpersService.currentDay(),
    //   "MM/DD/YYYY",
    //   "MM"
    // );
    // let year = this._HelpersService.changeformatDate(
    //   this._HelpersService.currentDay(),
    //   "MM/DD/YYYY",
    //   "YYYY"
    // );
    // let rangoMonth = this._HelpersService.InicioYFinDeMes(current);

    this.dateIni = moment().subtract(1, "year").format("YYYY-MM-DD");
    this.dateFin = moment().format("YYYY-MM-DD");

    this.filtros = {
      dateIni: this.dateIni,
      dateFin: this.dateFin,
    };
  }

  asignarValores() {
    this.isLoad = true;
    let bodyForm: CarteraDateBodyForm = {
      dateIni: this.filtros.dateIni,
      dateFin: this.filtros.dateFin,
      userId: Number(this.filtros.userId),
      tipo_venta: this.filtros.tipo_venta,
      status_pagado: this.filtros.status_pagado,
      allDates: this.filtros.allDates,
      allNumber: this.filtros.allNumber,
      // numDesde:this.filtros.numDesde,
      // numHasta:this.filtros.numHasta
      numRecibo: Number(this.filtros.numRecibo),
    };

    this._LogisticaService.getRecuperacionForAnyDates(bodyForm).subscribe(
      (recuperacion) => {
        logger.log(recuperacion);
        // this.recuperacionPorcentaje = recuperacion.recuperacionPorcentaje;
        // this.total = data.length

        this.Data = recuperacion.usuarios;
        this._TablasService.datosTablaStorage = recuperacion.usuarios;
        this._TablasService.total = 0;
        this._TablasService.busqueda = "";

        this.refreshCountries();
        this.isLoad = false;

        this.totalAbonos = recuperacion.totalesGenerales.abonosTotal;
        this.totalMetas = recuperacion.totalesGenerales.recuperacionTotal;
        this.recuperacionPorcentaje =
          recuperacion.totalesGenerales.recuperacionPorcentaje;

        this.generarGraficoRecuperacionPorUsuario(recuperacion.usuarios);
        this.generarGraficoPorcentajeRecuperacion(recuperacion.usuarios);

        logger.log("datosTablaStorage", this._TablasService.datosTablaStorage);
      },
      (error) => {
        this.isLoad = false;
      }
    );
  }

  BuscarValor() {
    let camposPorFiltrar: any[] = [
      ["user_id"],
      ["user", "apellido"],
      ["user", "apellido"],

      // ['user','name'],
      // ['user','apellido'],
    ];

    this._TablasService.buscarEnCampos(this.Data, camposPorFiltrar);

    if (this._TablasService.busqueda == "") {
      this.refreshCountries();
    }
  }

  refreshCountries() {
    this._TablasService.datosTablaStorage = [...this.Data].slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
  }

  openFiltros(content: any) {
    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
    }).result.then(
      (result) => {},
      (reason) => {}
    );
  }

  resetUser() {
    this.userId = Number(this._AuthService.dataStorage.user.userId);
    this.userStore.map((usuario) => {
      if (usuario.id == this.userId) {
        this.userIdString = `${usuario.id} - ${usuario.name} ${usuario.apellido}`;
      }
    });
  }

  limpiarFiltros() {
    this.setCurrentDate();

    // this.userId = Number(this._AuthService.dataStorage.user.userId);
    // this.tipoVenta = 1
    // this.status_pagado = 0 // por pagar
    // this.numDesde = 0
    // this.numHasta = 0

    if (this.isAdmin || this.isSupervisor) this.resetUser();

    this._RememberFiltersService.deleteFilterStorage(this.FilterSection);
    this.aplicarFiltros();
    // console.log(this.filtros);
  }

  generarGraficoRecuperacionPorUsuario(dataApi: any) {
    // Etiquetas = nombres de usuario
    this.barChartLabels = dataApi.map(
      (d) => `${d.user.name} ${d.user.apellido}`
    );

    // Dataset Abonos (Ventas)
    const abonosData = dataApi.map(
      (d) => Number(d.totales.abonosTotalLastMount) || 0
    );

    // Dataset Meta (Recuperación Total)
    const metaData = dataApi.map(
      (d) => Number(d.totales.recuperacionTotal) || 0
    );

    this.barChartData = [
      {
        label: "Abonos",
        data: abonosData,
        backgroundColor: "rgba(54,162,235,0.6)",
      },
      {
        label: "Metas",
        data: metaData,
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ];
    logger.log("    this.barChartData", this.barChartData);
  }

  generarGraficoPorcentajeRecuperacion(dataApi: any) {
    this.porcentajeLabels = dataApi.map((d) =>
      abreviarNombre(`${d.user.name} ${d.user.apellido}`)
    );

    const porcentajeArray = dataApi.map(
      (d) => Number(d.totales.recuperacionPorcentajeTotal) || 0
    );

    this.porcentajeData = [
      {
        label: "% Cumplimiento",
        data: porcentajeArray,
        backgroundColor: "rgba(54,162,235,0.6)",
        borderColor: "rgba(54,162,235,1)",
        borderWidth: 1,
      },
    ];

    const maxPorcentaje = Math.max(...porcentajeArray);
    this.porcentajeOptions.scales.yAxes[0].ticks.max =
      Math.ceil(maxPorcentaje / 10) * 10;
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
