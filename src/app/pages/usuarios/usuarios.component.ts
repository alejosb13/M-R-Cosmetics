import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { CommunicationService } from "@app/shared/services/communication.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Role } from "app/auth/login/models/auth.model";
import { Meta } from "app/shared/models/meta.model";
import {
  Recibo,
  RecibosRangosSinTerminar,
} from "app/shared/models/Recibo.model";
import { Usuario } from "app/shared/models/Usuario.model";
import { HelpersService } from "app/shared/services/helpers.service";
import { MetaService } from "app/shared/services/meta.service";
import { ReciboService } from "app/shared/services/recibo.service";
import { TablasService } from "app/shared/services/tablas.service";
import { UsuariosService } from "app/shared/services/usuarios.service";
import logger from "app/shared/utils/logger";
import { environment } from "environments/environment";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { AuthService } from "../../auth/login/service/auth.service";

@Component({
  selector: "app-usuarios",
  templateUrl: "./usuarios.component.html",
  styleUrls: ["./usuarios.component.css"],
})
export class UsuariosComponent implements OnInit {
  page = 1;
  pageSize = environment.PageSize;
  collectionSize = 0;
  Usuarios: Usuario[];

  recibo: Recibo;
  meta: Meta;
  idUsuario: number;

  recibosRangosSinTerminar: RecibosRangosSinTerminar[] = [];

  isLoad: boolean;
  Vendedor = Role.Vendedor;

  isAdmin: boolean;

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    private _UsuariosService: UsuariosService,
    private _TablasService: TablasService,
    private _ReciboService: ReciboService,
    private _HelpersService: HelpersService,
    private _MetaService: MetaService,
    private modalService: NgbModal,
    private _AuthService: AuthService,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this._AuthService.isAdmin();
    this.asignarValores();

    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
  }

  asignarValores() {
    this.isLoad = true;

    this._UsuariosService.getUsuario().subscribe(
      (usuarios: Usuario[]) => {
        console.log(usuarios);

        this.Usuarios = [...usuarios];
        this._TablasService.datosTablaStorage = [...usuarios];
        this._TablasService.total = usuarios.length;
        this._TablasService.busqueda = "";

        this.refreshCountries();
        this.isLoad = false;
      },
      (error) => {
        this.isLoad = false;
      }
    );
  }

  refreshCountries() {
    this._TablasService.datosTablaStorage = [...this.Usuarios].slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
  }

  BuscarValor() {
    let camposPorFiltrar: any[] = [
      ["name"],
      ["apellido"],
      ["cargo"],
      ["email"],
    ];

    this._TablasService.buscarEnCampos(this.Usuarios, camposPorFiltrar);

    if (this._TablasService.busqueda == "") {
      this.refreshCountries();
    }
  }

  eliminar({ id }: Usuario) {
    // console.log(id);
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    })
      .fire({
        title: "¿Estás seguro?",
        text: "Este usuario se eliminará y no podrás recuperarlo.",
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
              container: this.themeSite, // Clase para el modo oscuro
            },
          }).fire({
            title: "Eliminando el usuario",
            text: "Esto puede demorar un momento.",
            timerProgressBar: true,
            allowEscapeKey: false,
            allowOutsideClick: false,
            allowEnterKey: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          this._UsuariosService.deleteUsuario(id).subscribe((data) => {
            this.Usuarios = this.Usuarios.filter((Usuario) => Usuario.id != id);
            this.refreshCountries();

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

  cambiarEstadoRangoRecibos({ id }: RecibosRangosSinTerminar) {
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    }).fire({
      title: "Ignorando rango de recibo",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this._UsuariosService
      .changeReciboSinTerminarUsuario(id)
      .subscribe((data) => {
        console.log("respuesta", data);

        this.recibosRangosSinTerminar = this.recibosRangosSinTerminar.map(
          (recibo) => ({
            ...recibo,
            habilitado:
              recibo.id == id ? data.info.habilitado : recibo.habilitado,
          })
        );

        this.Usuarios = this.Usuarios.map((usuario) => ({
          ...usuario,
          recibosRangosSinTerminar:
            usuario.id == data.info.user_id
              ? this.recibosRangosSinTerminar
              : usuario.recibosRangosSinTerminar,
        }));
        this._TablasService.datosTablaStorage = this.Usuarios;
        // this.refreshCountries();

        Swal.mixin({
          customClass: {
            container: this.themeSite, // Clase para el modo oscuro
          },
        }).fire({
          text: "Estatus Modificado",
          icon: "success",
        });
      });
  }

  modificarRangoRecibo(content: any, recibo: Recibo, userId: number) {
    this.recibo = recibo;
    this.idUsuario = userId;
    // console.log(this.recibo);

    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        windowClass:
          this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
      })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  agregarRangoRecibo(content: any, userId: number) {
    this.recibo = undefined;
    this.idUsuario = userId;

    // console.log(this.recibo);

    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        windowClass:
          this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
      })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  modificarMeta(content: any, meta: Meta) {
    this.meta = meta;

    logger.log(this.meta);

    this.idUsuario = meta.user_id;

    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        windowClass:
          this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
      })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  agregarMeta(content: any, userId: number) {
    this.meta = undefined;
    this.idUsuario = userId;

    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        windowClass:
          this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
      })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  mostrarRecibosSinTerminar(content: any, user: Usuario) {
    this.recibosRangosSinTerminar = user.recibosRangosSinTerminar;
    console.log(this.recibosRangosSinTerminar);
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        windowClass:
          this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
      })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  FormsValues(recibo: Recibo) {
    console.log("[reciboForm]", recibo);

    recibo.user_id = this.idUsuario;
    if (this.recibo) {
      this._ReciboService.updateRecibo(this.recibo.id, recibo).subscribe(
        (userResp) => {
          // console.log(data);
          this._TablasService.datosTablaStorage = this.Usuarios.map(
            (usuario) => {
              if (usuario.id == userResp.user_id) usuario.recibo = userResp;

              return usuario;
            }
          );

          Swal.mixin({
            customClass: {
              container: this.themeSite, // Clase para el modo oscuro
            },
          })
            .fire({
              text: "Recibo modificado con exito",
              icon: "success",
            })
            .then((result) => {
              if (result.isConfirmed) window.location.reload();
            });
        },
        (HttpErrorResponse: HttpErrorResponse) => {
          let error: string = HttpErrorResponse.error[0];
          console.log(HttpErrorResponse);

          if (Array.isArray(HttpErrorResponse.error)) {
            Swal.mixin({
              customClass: {
                container: this.themeSite, // Clase para el modo oscuro
              },
            }).fire({
              title: "Error",
              html: error,
              icon: "error",
            });
          } else {
            Swal.mixin({
              customClass: {
                container: this.themeSite, // Clase para el modo oscuro
              },
            }).fire({
              title: "Error",
              html: HttpErrorResponse.error.mensaje,
              icon: "error",
            });
          }
        }
      );
    } else {
      this._ReciboService.insertRecibo(recibo).subscribe(
        (userResp) => {
          this._TablasService.datosTablaStorage = this.Usuarios.map(
            (usuario) => {
              if (usuario.id == userResp.user_id) usuario.recibo = userResp;

              return usuario;
            }
          );
          Swal.mixin({
            customClass: {
              container: this.themeSite, // Clase para el modo oscuro
            },
          })
            .fire({
              text: "Recibo agregado con exito",
              icon: "success",
            })
            .then((result) => {
              if (result.isConfirmed) window.location.reload();
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

  FormsValuesMeta(meta: Meta) {
    logger.log("[reciboFormService]", meta);

    meta.user_id = this.idUsuario;
    if (this.meta) {
      this._MetaService.updateMeta(this.meta.id, meta).subscribe(
        (userResp) => {
          this._TablasService.datosTablaStorage = this.Usuarios.map(
            (usuario) => {
              if (usuario.id == userResp.user_id) usuario.meta = userResp;

              return usuario;
            }
          );

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
          this._TablasService.datosTablaStorage = this.Usuarios.map(
            (usuario) => {
              if (usuario.id == userResp.user_id) usuario.meta = userResp;

              return usuario;
            }
          );
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

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
