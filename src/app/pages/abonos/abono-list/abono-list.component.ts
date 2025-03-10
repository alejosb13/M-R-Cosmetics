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

@Component({
  selector: "app-abono-list",
  templateUrl: "./abono-list.component.html",
  styleUrls: ["./abono-list.component.css"],
})
export class AbonoListComponent implements OnInit {
  Abonos: Abono[];
  TiposMetodos = TiposMetodos;
  numeroRecibo: string = "";

  metodoPagoEditar: number;
  detallePagoEditar: string = "";

  autorizacion: string = "";
  maxLength: number = 10; // Valor inicial por defecto

  editarAbonoId: number;

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
    private _ReciboService: ReciboService
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
        // factura: 1,
        // recibo: 1,
        // recibosRangosSinTerminar: 1,
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
      disablePaginate:0
    };

    let Subscription = this._Listado.abonoList(this.listadoFilter).subscribe(
      (Paginacion) => {
        this.listadoData = { ...Paginacion };
        this.Abonos = [...Paginacion.data];
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
    this.numeroRecibo = "";
    this.listadoFilter.autorizacion = "";

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
    // console.log(id);
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    })
      .fire({
        title: "¿Estás seguro?",
        text: "Este abono se eliminará y no podrás recuperarlo.",
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
            this.Abonos = this.Abonos.filter((abono) => abono.id != id);

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

  editarAbono(content: any, abono: Abono) {
    this.metodoPagoEditar = abono.metodo_pago.tipo;
    this.detallePagoEditar = abono.metodo_pago.detalle;
    this.editarAbonoId = abono.id;
    this.autorizacion = abono.metodo_pago.autorizacion;

    logger.log(abono);

    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
    })
      .result.then((result) => {})
      .catch((err) => {});
  }

  editarAbonoEnviar() {
    this.autorizacion = this.autorizacion?this.autorizacion:"";
    
    logger.log({
      metodoPagoEditar: this.metodoPagoEditar,
      detallePagoEditar: this.detallePagoEditar,
      autorizacion: this.autorizacion
    });
    
    if (this.metodoPagoEditar && this.detallePagoEditar) {
      if (this.metodoPagoEditar == 2 && (this.autorizacion.length <= 7 || this.autorizacion.length >= 21 )) {
        Swal.mixin({
          customClass: {
            container: this.themeSite, // Clase para el modo oscuro
          },
        }).fire({
          text: "La autorización de transferencia debe llevar mínimo 8 valores y máximo 20",
          icon: "warning",
        });
        return false;
      }

      if (this.metodoPagoEditar == 3 &&(this.autorizacion.length <= 6 || this.autorizacion.length >= 21 )) {
        Swal.mixin({
          customClass: {
            container: this.themeSite, // Clase para el modo oscuro
          },
        }).fire({
          text: "La autorización de transferencia debe llevar mínimo 7 valores y máximo 20",
          icon: "warning",
        });
        return false;
      }

      this._AbonoService
        .updateAbono(this.editarAbonoId, {
          metodoPagoEditar: this.metodoPagoEditar,
          detallePagoEditar: this.detallePagoEditar,
          autorizacion: this.autorizacion,
        })
        .subscribe(
          (data) => {
            Swal.mixin({
              customClass: {
                container: this.themeSite, // Clase para el modo oscuro
              },
            })
              .fire({
                text: "Abono modificado con exito",
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
          container: this.themeSite, // Clase para el modo oscuro
        },
      }).fire({
        text: "Complete todos los campos",
        icon: "warning",
      });
    }
  }

  eliminarRecibo(reciboEliminar: Abono) {
    console.log(reciboEliminar);
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    })
      .fire({
        title: "¿Estás seguro?",
        text: "Al eliminar este abono se eliminará también el recibo asociado a él y no podrás recuperarlo.",
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
            title: "Anulando el recibo",
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
            .deleteReciboHistorialCredito(reciboEliminar.recibo_historial.id)
            .subscribe((data) => {
              this.Abonos = this.Abonos.filter(
                (abono) =>
                  abono.recibo_historial.id !=
                  reciboEliminar.recibo_historial.id
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

  descargarAbonosExcell() {
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
