import { Component, ViewChild } from "@angular/core";
import { CommunicationService } from "@app/shared/services/communication.service";
import { Listado } from "@app/shared/services/listados.service";
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
import { environment } from "environments/environment";
import { Subscription } from "rxjs";
import { ChartOptions, ChartType, ChartDataSets } from "chart.js";
import { BaseChartDirective, Label } from "ng2-charts";
import * as moment from "moment";
import { abreviarNombre, formatearMonto } from "@app/shared/utils/helpers";
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

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
  selector: "app-ventas-anual",
  templateUrl: "./ventas-anual.component.html",
  styleUrls: ["./ventas-anual.component.scss"],
})
export class VentasAnualComponent {
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

  FilterSection: TypesFiltersForm = "ventasAnualFilter";

  totalAbonos: number;
  totalMetas: number;
  recuperacionPorcentaje: number | string;

  themeSite: string;
  themeSubscription: Subscription;

  public barChartLabels: string[] = [];
  public barChartData: any[] = [];
  public barChartOptions: any = {
    responsive: true,
    scales: {
      xAxes: [
        {
          stacked: false,
        },
      ],
      yAxes: [
        {
          stacked: false,
          ticks: {
            beginAtZero: true,
            callback: (value: number) => formatearMonto(value)
          },
          scaleLabel: {
            display: true,
            labelString: "Monto",
          },
        },
      ],
    },
    tooltips: {
      callbacks: {
        label: (tooltipItem: any, data: any) => {
          const label = data.datasets[tooltipItem.datasetIndex].label || '';
          const value = tooltipItem.yLabel;
          return label + ': ' + formatearMonto(value);
        }
      }
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: (value: number) => formatearMonto(value),
        color: '#444',
        font: {
          weight: 'bold',
          size: 10
        }
      }
    }
  };

  public barChartType = "bar";
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  // Procentaje chart
  public porcentajeLabels: string[] = [];
  public porcentajeData: any[] = [];
  public porcentajeOptions: any = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            // 👈 sin max fijo, se autoescala si hay >100%
          },
          scaleLabel: {
            display: true,
            labelString: "Porcentaje (%)",
          },
        },
      ],
    },
    plugins: {
      datalabels: {
        anchor: "end",
        align: "top",
        formatter: (value: number) => value.toFixed(2) + "%",
        color: '#444',
        font: {
          weight: 'bold',
          size: 11
        }
      },
    },
  };
  public porcentajeType = "bar";
  public porcentajeLegend = false;
  public porcentajePlugins = [pluginDataLabels];

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

    this.dateIni = moment().startOf("year").format("YYYY-MM-DD");
    this.dateFin = moment().endOf("year").format("YYYY-MM-DD");

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

    this._LogisticaService
      .getMetaForAnyDates(bodyForm)
      // .pipe(
      //   map((recuperaciones) => {
      //     let response = recuperaciones.filter(
      //       (recuperacion: any) => recuperacion.user_id == this.userId
      //     );

      //     // logger.log(response);
      //     return this.isAdmin || this.isSupervisor ? recuperaciones : response;
      //   })
      // )
      .subscribe(
        (recuperacion) => {
          logger.log(recuperacion);
          // this.recuperacionPorcentaje = recuperacion.recuperacionPorcentaje;
          // this.total = data.length

          this.Data = recuperacion;
          this._TablasService.datosTablaStorage = recuperacion;
          this._TablasService.total = 0;
          this._TablasService.busqueda = "";

          // this.refreshCountries();
          this.isLoad = false;

          this.totalAbonos = recuperacion.totalVentas;
          this.totalMetas = recuperacion.totalMetas;
          this.recuperacionPorcentaje = recuperacion.porcentaje;
          this.generarGraficoVentasMetas(recuperacion.usuarios);
          this.generarGraficoPorcentaje(recuperacion.usuarios);
        },
        (error) => {
          this.isLoad = false;
        }
      );
  }

  generarGraficoVentasMetas(dataApi: any) {
    // Etiquetas = nombres de usuario
    this.barChartLabels = dataApi.map((d) => d.name);

    // Dataset Ventas
    const ventasData = dataApi.map((d) => Number(d.totalVentas) || 0);
    // Dataset Metas
    const metasData = dataApi.map((d) => Number(d.totalMetas) || 0);

    this.barChartData = [
      {
        label: "Ventas",
        data: ventasData,
        backgroundColor: "rgba(54,162,235,0.6)", // azul
        borderColor: "rgba(54,162,235,1)",
        borderWidth: 1,
      },
      {
        label: "Metas",
        data: metasData,
        backgroundColor: "rgba(75,192,192,0.6)", // verde
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ];
  }

  generarGraficoPorcentaje(dataApi: any) {
    // Etiquetas = usuarios
    console.log("dataApi", dataApi);

    this.porcentajeLabels = dataApi.map((d) => abreviarNombre(`${d.name}`));

    // Datos = porcentaje
    const porcentajeArray = dataApi.map((d) => Number(d.porcentaje) || 0);

    this.porcentajeData = [
      {
        label: "% Cumplimiento",
        data: porcentajeArray,
        backgroundColor: "rgba(54,162,235,0.6)",
        borderColor: "rgba(54,162,235,1)",
        borderWidth: 1,
      },
    ];

    // Calcular max dinámico (si hay >100%)
    const maxPorcentaje = Math.max(...porcentajeArray);
    this.porcentajeOptions.scales.yAxes[0].ticks.max =
      Math.ceil(maxPorcentaje / 10) * 10; // redondea a decenas
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

  // Color determinístico por nombre (para que meta/venta de mismo usuario guarden relación)
  colorForString(name: string, alpha = 0.6) {
    let hash = 0;
    for (let i = 0; i < (name || "").length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const r = Math.abs(hash) % 256;
    const g = Math.abs(hash >> 8) % 256;
    const b = Math.abs(hash >> 16) % 256;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // Obtener todas las etiquetas (meses) únicas y ordenadas (p. ej. "2025-09")
  extractLabels(recuperacion: any[]) {
    const set = new Set<string>();
    recuperacion.forEach((u) => {
      (u.meses || []).forEach((m: any) => {
        const label = m.label ?? m.mes;
        if (label) set.add(label);
      });
    });
    // orden lexicográfico funciona para YYYY-MM
    return Array.from(set).sort();
  }

  // Obtener valor seguro por usuario y etiqueta (maneja meta, totalVentas, porcentaje)
  getMonthValue(
    usuario: any,
    label: string,
    key: "meta" | "totalVentas" | "porcentaje"
  ) {
    const mesObj = (usuario.meses || []).find(
      (m: any) => (m.label ?? m.mes) === label
    );
    if (!mesObj) return 0;
    if (key === "porcentaje") {
      return Number(mesObj.raw?.porcentaje ?? mesObj.porcentaje ?? 0);
    }
    return Number(mesObj[key] ?? 0);
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
