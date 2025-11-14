import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "app/auth/login/service/auth.service";
import { Factura } from "app/shared/models/Factura.model";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { Listado } from "app/shared/services/listados.service";
import {
  FiltrosList,
  Link,
  ListadoModel,
} from "app/shared/models/Listados.model";
import { Usuario } from "app/shared/models/Usuario.model";
import { TypesFiltersForm } from "app/shared/models/FiltersForm";
import { UsuariosService } from "app/shared/services/usuarios.service";
import { RememberFiltersService } from "app/shared/services/remember-filters.service";
import { HelpersService } from "app/shared/services/helpers.service";
import { ReciboService } from "app/shared/services/recibo.service";
import { Abono } from "app/shared/models/Abono.model";
import { AbonoService } from "app/shared/services/abono.service";
import logger from "app/shared/utils/logger";
import { TiposMetodos } from "app/shared/models/MetodoPago.model";
import { CommunicationService } from "@app/shared/services/communication.service";
import { MetricaSupervisorService } from "@app/shared/services/metrica-supervisor.service";

@Component({
  selector: "app-metricas-supervisor",
  templateUrl: "./metricas-supervisor.component.html",
  styleUrls: ["./metricas-supervisor.component.css"],
})
export class MetricasSupervisorComponent implements OnInit {
  Metricas: Abono[];
  TiposMetodos = TiposMetodos;
  numeroRecibo: string = "";

  metodoPagoEditar: number;
  detallePagoEditar: string = "";

  autorizacion: string = "";
  maxLength: number = 10; // Valor inicial por defecto

  editarMetricaId: number;

  isLoad: boolean;
  isAdmin: boolean;
  isSupervisor: boolean;

  userId: number = 0;

  idUsuario: number;

  userIdString: string;
  userStore: Usuario[];
  USersNames: string[] = [];

  dateIni: string;
  dateFin: string;
  allDates: boolean = false;

  roleName: string;
  listadoData: ListadoModel<Abono>;
  listadoFilter: FiltrosList = { link: null };

  FilterSection: TypesFiltersForm = "abonosHistorialFilter";

  private Subscription = new Subscription();

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    private _Listado: Listado,
    private _AuthService: AuthService,
    private NgbModal: NgbModal,
    private _UsuariosService: UsuariosService,
    private _RememberFiltersService: RememberFiltersService,
    private _HelpersService: HelpersService,
    private _AbonoService: AbonoService,
    private _ReciboService: ReciboService,
    private _MetricaSupervisorService: MetricaSupervisorService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor();
    this.roleName = String(this._AuthService.dataStorage.user.roleName);

    this.setCurrentDate();
    this.getUsers();
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
      })
      .subscribe((usuarios: Usuario[]) => {
        this.userStore = usuarios;
        this.USersNames = usuarios.map(
          (usuario) => `${usuario.id} - ${usuario.name} ${usuario.apellido}`
        );
      });
  }

  asignarValores() {
    this.isLoad = true;

    this.listadoFilter = {
      ...this.listadoFilter,
      roleName: this.roleName,
      disablePaginate: 0,
    };

    let Subscription = this._Listado.abonoList(this.listadoFilter).subscribe(
      (Paginacion) => {
        this.listadoData = { ...Paginacion };
        this.Metricas = [...Paginacion.data];
        this.isLoad = false;
      },
      (error) => {
        this.isLoad = false;
      }
    );
    this.Subscription.add(Subscription);
  }

  BuscarValor() {
    this.listadoFilter.link = null;
    this.asignarValores();
  }

  openFiltros(content: any) {
    this.listadoFilter.link = null;

    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
    }).result.then(
      (result) => {},
      (reason) => {}
    );
  }

  newPage(link: Link) {
    if (link.url == null) return;

    this.listadoFilter.link = link.url;

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
    };
  }

  limpiarFiltros() {
    this.setCurrentDate();

    this.allDates = false;
    this.numeroRecibo = "";
    this.listadoFilter.autorizacion = "";

    this._RememberFiltersService.deleteFilterStorage(this.FilterSection);
    this.aplicarFiltros();
  }

  aplicarFiltros(submit: boolean = false) {
    let filtrosStorage = this._RememberFiltersService.getFilterStorage();

    if (filtrosStorage.hasOwnProperty(this.FilterSection) && !submit) {
      this.listadoFilter = { ...filtrosStorage[this.FilterSection] };
      this.userId = Number(this.listadoFilter.userId);
      this.dateIni = this.listadoFilter.dateIni;
      this.dateFin = this.listadoFilter.dateFin;
      this.allDates = this.listadoFilter.allDates;
      this.numeroRecibo = this.listadoFilter.numeroRecibo;
    } else {
      if (!submit) {
        console.log(this.userId);

        if (this.isAdmin || this.isSupervisor) {
          this.userId = 0;
        } else {
          this.userId = Number(this._AuthService.dataStorage.user.userId);
        }
      }

      if (!this.dateIni || !this.dateFin) this.setCurrentDate();

      if (
        this._HelpersService.siUnaFechaEsIgualOAnterior(
          this.dateIni,
          this.dateFin
        )
      )
        this.setCurrentDate();
      this.listadoFilter = {
        ...this.listadoFilter,
        dateIni: this.dateIni,
        dateFin: this.dateFin,
        userId: this.userId,
        allDates: this.allDates,
        numeroRecibo: this.numeroRecibo,
      };
    }

    this._RememberFiltersService.setFilterStorage(this.FilterSection, {
      ...this.listadoFilter,
    });
    this.asignarValores();

    this.NgbModal.dismissAll();
  }

  eliminar({ id }: Abono) {
    Swal.mixin({
      customClass: {
        container: this.themeSite,
      },
    })
      .fire({
        title: "¿Estás seguro?",
        text: "Esta métrica se eliminará y no podrás recuperarla.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#51cbce",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      })
      .then((result) => {
        if (result.isConfirmed) {
          this._AbonoService.deleteAbono(id).subscribe((data) => {
            this.Metricas = this.Metricas.filter((metrica) => metrica.id != id);

            Swal.mixin({
              customClass: {
                container: this.themeSite,
              },
            }).fire({
              text: data[0],
              icon: "success",
            });
          });
        }
      });
  }

  editarMetrica(content: any, metrica: Abono) {
    this.metodoPagoEditar = metrica.metodo_pago.tipo;
    this.detallePagoEditar = metrica.metodo_pago.detalle;
    this.editarMetricaId = metrica.id;
    this.autorizacion = metrica.metodo_pago.autorizacion;

    logger.log(metrica);

    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
    })
      .result.then((result) => {})
      .catch((err) => {});
  }

  editarMetricaEnviar() {
    this.autorizacion = this.autorizacion ? this.autorizacion : "";

    logger.log({
      metodoPagoEditar: this.metodoPagoEditar,
      detallePagoEditar: this.detallePagoEditar,
      autorizacion: this.autorizacion,
    });

    if (this.metodoPagoEditar && this.detallePagoEditar) {
      if (
        this.metodoPagoEditar == 2 &&
        (this.autorizacion.length <= 7 || this.autorizacion.length >= 21)
      ) {
        Swal.mixin({
          customClass: {
            container: this.themeSite,
          },
        }).fire({
          text: "La autorización de transferencia debe llevar mínimo 8 valores y máximo 20",
          icon: "warning",
        });
        return false;
      }

      if (
        this.metodoPagoEditar == 3 &&
        (this.autorizacion.length <= 6 || this.autorizacion.length >= 21)
      ) {
        Swal.mixin({
          customClass: {
            container: this.themeSite,
          },
        }).fire({
          text: "La autorización de transferencia debe llevar mínimo 7 valores y máximo 20",
          icon: "warning",
        });
        return false;
      }

      this._AbonoService
        .updateAbono(this.editarMetricaId, {
          metodoPagoEditar: this.metodoPagoEditar,
          detallePagoEditar: this.detallePagoEditar,
          autorizacion: this.autorizacion,
        })
        .subscribe(
          (data) => {
            Swal.mixin({
              customClass: {
                container: this.themeSite,
              },
            })
              .fire({
                text: "Métrica modificada con exito",
                icon: "success",
              })
              .then((result) => {
                window.location.reload();
              });
          },
          (error) => {
            this.isLoad = false;
          }
        );
    } else {
      Swal.mixin({
        customClass: {
          container: this.themeSite,
        },
      }).fire({
        text: "Complete todos los campos",
        icon: "warning",
      });
    }
  }

  eliminarRecibo(metricaEliminar: Abono) {
    console.log(metricaEliminar);
    Swal.mixin({
      customClass: {
        container: this.themeSite,
      },
    })
      .fire({
        title: "¿Estás seguro?",
        text: "Al eliminar esta métrica se eliminará también el recibo asociado a él y no podrás recuperarlo.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#51cbce",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      })
      .then((result) => {
        if (result.isConfirmed) {
          Swal.mixin({
            customClass: {
              container: this.themeSite,
            },
          }).fire({
            title: "Anulando la métrica",
            text: "Esto puede demorar un momento.",
            timerProgressBar: true,
            allowEscapeKey: false,
            allowOutsideClick: false,
            allowEnterKey: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          this._ReciboService
            .deleteReciboHistorialCredito(metricaEliminar.recibo_historial.id)
            .subscribe((data) => {
              this.Metricas = this.Metricas.filter(
                (metrica) =>
                  metrica.recibo_historial.id !==
                  metricaEliminar.recibo_historial.id
              );
              Swal.mixin({
                customClass: {
                  container: this.themeSite,
                },
              }).fire({
                text: data[0],
                icon: "success",
              });
            });
        }
      });
  }

  descargarMetricasExcell() {
    this._AbonoService.AbonosExcell({
      ...this.listadoFilter,
      disablePaginate: 1,
    });
  }

  updateMaxLengthAutorizacion(element: any) {
    if (element.value == "2") {
      this.maxLength = 8;
    }
    if (element.value == "3") {
      this.maxLength = 7;
    }
  }

  ngOnDestroy() {
    this.Subscription.unsubscribe();
    this.themeSubscription.unsubscribe();
  }
}
