import { Component, ViewChild, ElementRef } from "@angular/core";
import { Talonario } from "@app/shared/models/Talonario.model";
import { Usuario } from "@app/shared/models/Usuario.model";
import { TalonariosService } from "@app/shared/services/talonarios.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "app/auth/login/service/auth.service";
import {
  FiltrosList,
  Link,
  ListadoModel,
} from "app/shared/models/Listados.model";
import { HelpersService } from "app/shared/services/helpers.service";
import Swal from "sweetalert2";
import { Subscription } from "rxjs";
import { ReciboService } from "@app/shared/services/recibo.service";
import { CommunicationService } from "@app/shared/services/communication.service";
import { Listado } from "@app/shared/services/listados.service";
import { LogisticaService } from "@app/shared/services/logistica.service";
import { UbicacionesService } from "@app/shared/services/ubicaciones.service";
import { HttpErrorResponse } from "@angular/common/http";


@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.scss']
})
export class DepartamentosComponent {
  dateIni: string;
  dateFin: string;
  allDates: boolean = false;
  listadoFilter: FiltrosList = {
    link: null,
    estado: 1,
    disablePaginate: 0,
  };

  listadoData: ListadoModel<any>;
  Departamentos: any[];
  Departamento: any;

  isLoad: boolean;
  userStore: Usuario[];

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    public _TalonariosService: TalonariosService,
    public _AuthService: AuthService,
    public _ReciboService: ReciboService,
    private NgbModal: NgbModal,
    private _HelpersService: HelpersService,
    private _Listado: Listado,
    private _UbicacionesService: UbicacionesService
  ) {}

  ngOnInit(): void {
    // this.getUsers();
    this.setCurrentDate();
    this.asignarValores();

    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
  }

  asignarValores() {
    this.isLoad = true;
    this.listadoFilter = {
      ...this.listadoFilter,
      dateIni: this.dateIni,
      dateFin: this.dateFin,
      allDates: this.allDates,
      estado: 1,
    };

    this._UbicacionesService.departamentos(this.listadoFilter).subscribe(
      (paginacion: any) => {
        console.log(paginacion);
        
        this.listadoData = paginacion;
        this.Departamentos = [...paginacion.data];

        this.isLoad = false;
      },
      (error) => {
        this.isLoad = false;
      }
    );
    this.NgbModal.dismissAll();
  }

  openFiltros(content: any, gasto: Talonario = null) {
    // console.log(gasto);
    // if (gasto) this.Talonario = gasto;
    // console.log(this.Gasto);

    this.listadoFilter.link = null;

    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
    }).result.then(
      (result) => {},
      (reason) => {}
    );
  }

  openModalDepartamento(content: any, departamento = null) {
    // console.log(gasto);
    // if (gasto) this.Talonario = gasto;
    // console.log(this.Gasto);

    this.listadoFilter.link = null;
    this.Departamento = departamento;

    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
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

  eliminar(departamento: any) {
    // console.log(data);
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    })
      .fire({
        title: "¿Estás seguro?",
        text: "Este departamento se eliminará y no podrás recuperarla.",
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
            title: "Eliminando la zona",
            text: "Esto puede demorar un momento.",
            timerProgressBar: true,
            allowEscapeKey: false,
            allowOutsideClick: false,
            allowEnterKey: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          this._UbicacionesService.departamentosDelete(departamento.id).subscribe((data) => {
            // this.asignarValores();
            // console.log(this.Talonarios);
            // console.log(dataTalonario);

            this.Departamentos = this.Departamentos.filter((_) => _.id !== departamento.id);
            Swal.mixin({
              customClass: {
                container: this.themeSite, // Clase para el modo oscuro
              },
            }).fire({
              text: data.mensaje,
              icon: "success",
            });
          });
        }
      });
  }

  FormValuesForm(departamento: any) {
    console.log(departamento);

    if (this.Departamento) {
      this.EditarDepartamento(departamento);
    } else {
      this.creacionDepartamento(departamento);
    }
  }

  creacionDepartamento(departamento) {
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    }).fire({
      title: "Creando departamento",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this._UbicacionesService.departamentosInsert(departamento).subscribe(
      (data) => {
        console.log(data);
        Swal.mixin({
          customClass: {
            container: this.themeSite, // Clase para el modo oscuro
          },
        })
          .fire({
            text: "Departamento agregada con éxito",
            icon: "success",
          })
          .then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
      },
      (HttpErrorResponse: HttpErrorResponse) => {
        let error: string =
          this._HelpersService.errorResponse(HttpErrorResponse);
        console.log(error);

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

  EditarDepartamento(departamento) {
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    }).fire({
      title: "Modificando el departamento",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this._UbicacionesService.departamentosEditar(departamento, this.Departamento.id).subscribe(
      (data) => {
        console.log(data);
        Swal.mixin({
          customClass: {
            container: this.themeSite, // Clase para el modo oscuro
          },
        })
          .fire({
            text: "Departamento modificada con éxito",
            icon: "success",
          })
          .then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
      },
      (HttpErrorResponse: HttpErrorResponse) => {
        let error: string =
          this._HelpersService.errorResponse(HttpErrorResponse);
        console.log(error);

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

  limpiarFiltros() {
    this.setCurrentDate();
    this.allDates = false;

    this.asignarValores();
    this.NgbModal.dismissAll();
  }

  getUsers() {
    this._Listado
      .UsuariosList({
        disablePaginate: 1,
        estado: 1,
        // factura: 1,
        recibo: 1,
        // recibosRangosSinTerminar: 1,
      })
      .subscribe((usuarios: Usuario[]) => {
        this.userStore = usuarios;
      });
  }

  newPage(link: Link) {
    if (link.url == null) return;
    // console.log(link);

    this.listadoFilter.link = link.url;

    this.asignarValores();
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
