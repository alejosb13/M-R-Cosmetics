import { Component, OnInit } from "@angular/core";
import { Factura } from "app/shared/models/Factura.model";
import {
  FiltrosList,
  Link,
  ListadoModel,
} from "app/shared/models/Listados.model";
import { Listado } from "app/shared/services/listados.service";
import { Subscription } from "rxjs";
import { DevolucionFacturaService } from "../devoluciones/services/devolucion-factura.service";
import { AuthService } from "app/auth/login/service/auth.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { Meta, MetaHistorial } from "app/shared/models/meta.model";
import { Usuario } from "app/shared/models/Usuario.model";
import { UsuariosService } from "app/shared/services/usuarios.service";
import { RememberFiltersService } from "app/shared/services/remember-filters.service";
import { HelpersService } from "app/shared/services/helpers.service";
import { TypesFiltersForm } from "app/shared/models/FiltersForm";
import logger from "app/shared/utils/logger";
import { MetaService } from "app/shared/services/meta.service";
import { HttpErrorResponse } from "@angular/common/http";
import { CommunicationService } from "@app/shared/services/communication.service";

@Component({
  selector: "app-metas",
  templateUrl: "./metas.component.html",
  styleUrls: ["./metas.component.css"],
})
export class MetasComponent implements OnInit {
  MetasHistorico: Meta[];
  isLoad: boolean;
  isAdmin: boolean;
  isSupervisor: boolean;
  status_pagado: number;
  Factura: Factura;
  userId: number = 0;

  meta: Meta;
  idUsuario: number;

  userIdString: string;
  userStore: Usuario[];
  USersNames: string[] = [];

  dateIni: string;
  dateFin: string;
  allDates: boolean = false;

  mesNewMeta: string;

  roleName: string;
  listadoData: ListadoModel<Meta>;
  listadoFilter: FiltrosList = { link: null };

  FilterSection: TypesFiltersForm = "metasHistorialFilter";

  private Subscription = new Subscription();

  dateMetaAsignacionHistorialEditar: string;
  montoMetaHistorialEditar: number;
  IdMetaHistorialEditar: number;

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    private _Listado: Listado,
    private _DevolucionFacturaService: DevolucionFacturaService,
    private _AuthService: AuthService,
    private NgbModal: NgbModal,
    private _UsuariosService: UsuariosService,
    private _RememberFiltersService: RememberFiltersService,
    private _HelpersService: HelpersService,
    private _MetaService: MetaService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor();
    // this.userId = 0;
    // this.userId = Number(this._AuthService.dataStorage.user.userId);
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
    this._UsuariosService.getUsuario().subscribe((usuarios: Usuario[]) => {
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
    };

    let Subscription = this._Listado
      .metasHistoricoList(this.listadoFilter)
      .subscribe(
        (Paginacion) => {
          this.listadoData = { ...Paginacion };
          this.MetasHistorico = [...Paginacion.data];
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
    // console.log(this.mesNewMeta);
    this.listadoFilter.link = null;

    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
    }).result.then(
      (result) => {},
      (reason) => {}
    );
  }

  openModalMetaDeclarada(content: any) {
    this.NgbModal.open(content, {
      size: "xl",
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
    }).result.then(
      (result) => {},
      (reason) => {}
    );
  }

  openDevolverFactura(content: any, Factura: Factura) {
    this.Factura = Factura;
    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
    })
      .result.then((result) => {})
      .catch((err) => {});
  }

  FormsValuesDevolucion(DevolucionProducto: any) {
    // console.log("[DevolucionFacturaForm]", DevolucionProducto);

    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    }).fire({
      title: "Cargando la devolución",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this._DevolucionFacturaService
      .insertDevolucion(DevolucionProducto)
      .subscribe((data) => {
        console.log("[response]", data);

        Swal.mixin({
          customClass: {
            container: this.themeSite, // Clase para el modo oscuro
          },
        })
          .fire({
            text: "La devolución fue realizada con exito",
            icon: "success",
          })
          .then((result) => {
            if (result.isConfirmed) {
              location.reload();
            }
          });
      });
  }

  newPage(link: Link) {
    if (link.url == null) return;
    // console.log(link);

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

    // if(this.isAdmin || this.isSupervisor) this.resetUser();

    this._RememberFiltersService.deleteFilterStorage(this.FilterSection);
    this.aplicarFiltros();

    // console.log(this.filtros);
  }

  aplicarFiltros(submit: boolean = false) {
    // console.log(this.allDates);
    let filtrosStorage = this._RememberFiltersService.getFilterStorage();

    if (filtrosStorage.hasOwnProperty(this.FilterSection) && !submit) {
      // solo al iniciar con datos en storage
      this.listadoFilter = { ...filtrosStorage[this.FilterSection] };
      this.userId = Number(this.listadoFilter.userId);
      this.dateIni = this.listadoFilter.dateIni;
      this.dateFin = this.listadoFilter.dateFin;
      this.allDates = this.listadoFilter.allDates;
    } else {
      if (!submit) {
        console.log(this.userId);

        // this.userId = Number(this._AuthService.dataStorage.user.userId);
        this.userId = 0;
      }

      if (!this.dateIni || !this.dateFin) this.setCurrentDate(); // si las fechas estan vacias, se setean las fechas men actual

      if (
        this._HelpersService.siUnaFechaEsIgualOAnterior(
          this.dateIni,
          this.dateFin
        )
      )
        this.setCurrentDate(); // si las fecha inicial es mayor a la final, se setean las fechas mes actual
      this.listadoFilter = {
        ...this.listadoFilter,
        dateIni: this.dateIni,
        dateFin: this.dateFin,
        userId: this.userId,
        allDates: this.allDates,
      };
    }

    this._RememberFiltersService.setFilterStorage(this.FilterSection, {
      ...this.listadoFilter,
    });
    this.asignarValores();
    this.NgbModal.dismissAll();
  }

  modificarMeta(content: any, meta: Meta) {
    this.meta = meta;

    logger.log(this.meta);

    this.idUsuario = meta.user_id;

    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
    }).result.then(
      (result) => {},
      (reason) => {}
    );
  }

  agregarMeta(content: any, userId: number) {
    this.meta = undefined;
    this.idUsuario = userId;

    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
    }).result.then(
      (result) => {},
      (reason) => {}
    );
  }

  editarMetaHistorial(content: any, meta: MetaHistorial) {
    this.dateMetaAsignacionHistorialEditar =
      this._HelpersService.changeformatDate(
        meta.fecha_asignacion,
        "YYYY/MM/DD HH:mm:ss",
        "YYYY-MM-DD"
      );
    this.montoMetaHistorialEditar = meta.monto_meta;
    this.IdMetaHistorialEditar = meta.id;

    logger.log(meta);

    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
    })
      .result.then((result) => {})
      .catch((err) => {});
  }

  sendModificacionMetaHistorial() {
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    }).fire({
      title: "Modificando Meta",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this._MetaService.IsLoad = true;
    this._MetaService
      .updateMetaHistorial(this.IdMetaHistorialEditar, {
        fecha_asignacion: this.dateMetaAsignacionHistorialEditar,
        monto_meta: this.montoMetaHistorialEditar,
      })
      .subscribe(
        (data) => {
          this._MetaService.IsLoad = false;
          // console.log(data);
          Swal.mixin({
            customClass: {
              container: this.themeSite, // Clase para el modo oscuro
            },
          })
            .fire({
              text: "Meta modificada con exito",
              icon: "success",
            })
            .then((result) => {
              if (result.isConfirmed) this.aplicarFiltros();
              // if (result.isConfirmed) window.location.reload();
            });
        },
        (HttpErrorResponse: HttpErrorResponse) => {
          this._MetaService.IsLoad = false;
          // console.log(HttpErrorResponse );
          let error: string =
            this._HelpersService.errorResponse(HttpErrorResponse);

          Swal.mixin({
            customClass: {
              container: this.themeSite, // Clase para el modo oscuro
            },
          }).fire({
            title: "Error",
            html: error,
            icon: "error",
          });
        }
      );
  }

  FormsValuesMeta(meta: Meta) {
    logger.log("[reciboFormService]", meta);

    meta.user_id = this.idUsuario;
    if (this.meta) {
      this._MetaService.updateMeta(this.meta.id, meta).subscribe(
        (userResp) => {
          this.userStore = this.userStore.map((usuario) => {
            if (usuario.id == userResp.user_id) usuario.meta = userResp;

            return usuario;
          });

          Swal.mixin({
            customClass: {
              container: this.themeSite, // Clase para el modo oscuro
            },
          }).fire({
            text: "Meta modificada con exito",
            icon: "success",
          });
        },
        (HttpErrorResponse: HttpErrorResponse) => {
          let error: string = HttpErrorResponse.error[0];

          Swal.mixin({
            customClass: {
              container: this.themeSite, // Clase para el modo oscuro
            },
          }).fire({
            title: "Error",
            html: error,
            icon: "error",
          });
        }
      );
    } else {
      this._MetaService.insertMeta(meta).subscribe(
        (userResp) => {
          this.userStore = this.userStore.map((usuario) => {
            if (usuario.id == userResp.user_id) usuario.meta = userResp;

            return usuario;
          });
          Swal.mixin({
            customClass: {
              container: this.themeSite, // Clase para el modo oscuro
            },
          })
            .fire({
              text: "Meta agregada con exito",
              icon: "success",
            })
            .then((result) => {
              // if (result.isConfirmed) window.location.reload()
            });
        },
        (HttpErrorResponse: HttpErrorResponse) => {
          // let error:string =  HttpErrorResponse.error[0]
          let error: string =
            this._HelpersService.errorResponse(HttpErrorResponse);

          Swal.mixin({
            customClass: {
              container: this.themeSite, // Clase para el modo oscuro
            },
          }).fire({
            title: "Error",
            html: error,
            icon: "error",
          });
        }
      );
    }
  }

  eliminarMetaHistorial(meta: MetaHistorial) {
    // console.log(id);
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    })
      .fire({
        title: "¿Estás seguro?",
        text: "Esta se eliminará y no podrás recuperarla.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#51cbce",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      })
      .then((result) => {
        if (result.isConfirmed) {
          this._MetaService.deleteMetaHistorial(meta.id).subscribe((data) => {
            this.MetasHistorico = this.MetasHistorico.filter(
              (metah) => metah.id != meta.id
            );

            Swal.mixin({
              customClass: {
                container: this.themeSite, // Clase para el modo oscuro
              },
            }).fire({
              text: data[0],
              icon: "success",
            });
          });
        }
      });
  }

  newMetaHistorial() {
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    }).fire({
      title: "Creando Meta",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this._MetaService.IsLoad = true;
    let mesNewMeta = this._HelpersService.changeformatDate(
      this.mesNewMeta,
      "YYYY-MM",
      "YYYY-MM-DD"
    );
    // console.log(this.mesNewMeta);
    // console.log(mesNewMeta);
    this._MetaService.newMetaHistorial(mesNewMeta).subscribe(
      (data) => {
        this._MetaService.IsLoad = false;
        // console.log(data);
        Swal.mixin({
          customClass: {
            container: this.themeSite, // Clase para el modo oscuro
          },
        }).fire({
          text: "Meta agregada con exito",
          icon: "success",
        });
      },
      (HttpErrorResponse: HttpErrorResponse) => {
        this._MetaService.IsLoad = false;
        // console.log(HttpErrorResponse );
        let error: string =
          this._HelpersService.errorResponse(HttpErrorResponse);

        Swal.mixin({
          customClass: {
            container: this.themeSite, // Clase para el modo oscuro
          },
        }).fire({
          title: "Error",
          html: error,
          icon: "error",
        });
      }
    );
  }

  ngOnDestroy() {
    this.Subscription.unsubscribe();
    this.themeSubscription.unsubscribe();
  }
}
