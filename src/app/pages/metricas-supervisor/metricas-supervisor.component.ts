import { Component } from "@angular/core";
import { CommunicationService } from "@app/shared/services/communication.service";
import { Listado } from "@app/shared/services/listados.service";
import { MetricaSupervisorService } from "@app/shared/services/metrica-supervisor.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "app/auth/login/service/auth.service";
import { TypesFiltersForm } from "app/shared/models/FiltersForm";
import { CarteraDateBodyForm } from "app/shared/models/Logistica.model";
import { Usuario } from "app/shared/models/Usuario.model";
import { HelpersService } from "app/shared/services/helpers.service";
import { LogisticaService } from "app/shared/services/logistica.service";
import { RememberFiltersService } from "app/shared/services/remember-filters.service";
import { TablasService } from "app/shared/services/tablas.service";
import logger from "app/shared/utils/logger";
import { environment } from "environments/environment";
import { Subscription } from "rxjs";

type Recuperacion = {
  user_id: number;
  recuperacion_mensual: {
    facturasTotal: number;
    abonosTotal: number;
    abonosTotalLastMount: number;
    recuperacionPorcentaje: number;
    recuperacionTotal: number;
    user_id: number;
    user: Usuario;
    totalVentas: number;
    meta: number;
    porcentaje: number;
  };
  clientes_nuevos: number;
  clientes_reactivados: any[];
  cliente_meta: number;
};
@Component({
  selector: "app-metricas-supervisor",
  templateUrl: "./metricas-supervisor.component.html",
  styleUrls: ["./metricas-supervisor.component.css"],
})
export class MetricasSupervisorComponent {
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

  FilterSection: TypesFiltersForm = "recuperacionMensualFilter";

  // Totales
  totalMontoCumplimiento: number = 0;
  totalMontoMeta: number = 0;
  totalClientesNuevos: number = 0;
  totalClientesReactivados: number = 0;
  totalClientesGlobal: number = 0;
  totalClientesMeta: number = 0;

  totalAbonos: number;
  totalMetas: number;
  recuperacionPorcentaje: number | string;

  // Variables para el modal de editar meta
  usuarioSeleccionado: Recuperacion;
  metaClienteEditando: number;
  dateIniMeta: string;
  dateFinMeta: string;

  // Variables para el modal de monto reactivación
  montoReactivacion: number = 0;

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    private _TablasService: TablasService,
    private _AuthService: AuthService,
    private _LogisticaService: LogisticaService,
    private NgbModal: NgbModal,
    private _HelpersService: HelpersService,
    private _RememberFiltersService: RememberFiltersService,
    private _Listado: Listado,
    private _MetricaSupervisorService: MetricaSupervisorService,
  ) {}

  ngOnInit(): void {
    this.isLoad = true;

    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor();
    this.userId = Number(this._AuthService.dataStorage.user.userId);

    if (this.isAdmin || this.isSupervisor) {
      this.getUsers();
    }

    this.aplicarFiltros();

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
          (usuario) => `${usuario.id} - ${usuario.name} ${usuario.apellido}`,
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
          this.dateFin,
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
    let current = this._HelpersService.changeformatDate(
      this._HelpersService.currentDay(),
      "MM/DD/YYYY",
      "YYYY-MM-DD",
    );
    let month = this._HelpersService.changeformatDate(
      this._HelpersService.currentDay(),
      "MM/DD/YYYY",
      "MM",
    );
    let year = this._HelpersService.changeformatDate(
      this._HelpersService.currentDay(),
      "MM/DD/YYYY",
      "YYYY",
    );
    let rangoMonth = this._HelpersService.InicioYFinDeMes(current);

    this.dateIni = `${year}-${month}-01`;
    this.dateFin = `${year}-${month}-${rangoMonth.ultimoDiaDelMes}`;

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

    

    this._MetricaSupervisorService.indicemesMesClientesReactivasoSupervisos(bodyForm).subscribe(
      (metricas) => {
        logger.log(metricas);
        if(metricas.data){
          this.montoReactivacion = metricas.data.monto;
        }else{
          this.montoReactivacion = 0;
        }

      },
      (error) => {
        this.isLoad = false;
      },
    );

    this._MetricaSupervisorService.getMetricaSupervisor(bodyForm).subscribe(
      (metricas) => {
        logger.log(metricas);
        // this.recuperacionPorcentaje = recuperacion.recuperacionPorcentaje;
        // this.total = data.length

        this.Data = metricas;
        // this._TablasService.datosTablaStorage = recuperacion.listadoVentas;
        // this._TablasService.total = 0;
        // this._TablasService.busqueda = "";

        // this.refreshCountries();
        this.calcularTotales();
        this.isLoad = false;

        // this.totalAbonos = recuperacion.totalVentas;
        // this.totalMetas = recuperacion.totalMetas;
        // this.recuperacionPorcentaje = recuperacion.porcentaje;
      },
      (error) => {
        this.isLoad = false;
      },
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
      (this.page - 1) * this.pageSize + this.pageSize,
    );
  }

  openFiltros(content: any) {
    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
    }).result.then(
      (result) => {},
      (reason) => {},
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

    if (this.isAdmin || this.isSupervisor) this.resetUser();

    this._RememberFiltersService.deleteFilterStorage(this.FilterSection);
    this.aplicarFiltros();
  }

  calcularPorcentaje = (
    parte: number,
    total: number,
    decimales: number = 2,
  ): number => {
    // 1. Validar que los valores sean números válidos y no sean NaN o Infinity
    if (!Number.isFinite(parte) || !Number.isFinite(total)) {
      return 0;
    }

    // 2. Evitar la división por cero
    if (total === 0) {
      return 0;
    }

    // 3. Calcular el porcentaje
    const porcentaje = (parte / total) * 100;

    // 4. Retornar el valor redondeado para evitar decimales infinitos
    // Usamos parseFloat y toFixed para asegurar el formato numérico
    return parseFloat(porcentaje.toFixed(decimales));
  };

  calcularTotales() {
    if (!this.Data || this.Data.length === 0) {
      this.totalMontoCumplimiento = 0;
      this.totalMontoMeta = 0;
      this.totalClientesNuevos = 0;
      this.totalClientesReactivados = 0;
      this.totalClientesGlobal = 0;
      this.totalClientesMeta = 0;
      return;
    }

    this.totalMontoCumplimiento = this.Data.reduce(
      (sum, item) => sum + (item.recuperacion_mensual?.abonosTotalLastMount || 0),
      0
    );
    this.totalMontoMeta = this.Data.reduce(
      (sum, item) => sum + (item.recuperacion_mensual?.recuperacionTotal || 0),
      0
    );
    this.totalClientesNuevos = this.Data.reduce(
      (sum, item) => sum + (item.clientes_nuevos || 0),
      0
    );
    this.totalClientesReactivados = this.Data.reduce(
      (sum, item) => sum + (item.clientes_reactivados?.length || 0),
      0
    );
    this.totalClientesGlobal = this.totalClientesNuevos + this.totalClientesReactivados;
    this.totalClientesMeta = this.Data.reduce(
      (sum, item) => sum + (item.cliente_meta || 0),
      0
    );
  }

  openEditarMeta(content: any, recuperacion: Recuperacion) {
    this.usuarioSeleccionado = recuperacion;
    this.metaClienteEditando = recuperacion.cliente_meta || 0;
    // Guardar las fechas del filtro actual
    this.dateIniMeta = this.dateIni;
    this.dateFinMeta = this.dateFin;
    
    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-meta-title",
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
    }).result.then(
      (result) => {},
      (reason) => {},
    );
  }

  guardarMetaCliente() {
    if (!this.metaClienteEditando || this.metaClienteEditando < 0) {
      return;
    }

    const bodyForm = {
      user_id: this.usuarioSeleccionado.user_id,
      cliente_meta: this.metaClienteEditando,
      dateIni: this.dateIniMeta,
      dateFin: this.dateFinMeta,
    };

    this._MetricaSupervisorService.updateMetaCliente(bodyForm).subscribe(
      (response) => {
        logger.log('Meta actualizada:', response);
        this.NgbModal.dismissAll();
        // Recargar los datos de la tabla
        this.aplicarFiltros();
      },
      (error) => {
        logger.error('Error al actualizar meta:', error);
        // Aquí puedes agregar una notificación de error si tienes un servicio de notificaciones
      }
    );
  }

  openMontoReactivacion(content: any) {
    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-reactivacion-title",
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
    }).result.then(
      (result) => {},
      (reason) => {},
    );
  }

  guardarMontoReactivacion() {
    if (!this.montoReactivacion || this.montoReactivacion < 0) {
      return;
    }

    const bodyForm = {
      monto: this.montoReactivacion,
      fecha: this.dateIni, // Fecha del mes del filtro
    };

    this._MetricaSupervisorService.updateMontoReactivacion(bodyForm).subscribe(
      (response) => {
        logger.log('Monto de reactivación actualizado:', response);
        this.NgbModal.dismissAll();
        // Recargar los datos de la tabla
        this.aplicarFiltros();
      },
      (error) => {
        logger.error('Error al actualizar monto de reactivación:', error);
      }
    );
  }

  obtenerNombreMes(): string {
    if (!this.dateIni) return '';
    
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const fecha = new Date(this.dateIni + 'T00:00:00');
    const mes = fecha.getMonth();
    const año = fecha.getFullYear();
    
    return `${meses[mes]} ${año}`;
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
