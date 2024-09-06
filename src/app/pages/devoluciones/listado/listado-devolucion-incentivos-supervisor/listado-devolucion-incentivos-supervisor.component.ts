import { Component, ViewChild, ElementRef } from "@angular/core";
import { Usuario } from "@app/shared/models/Usuario.model";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "app/auth/login/service/auth.service";
import {
  FiltrosList,
  Link,
  ListadoModel,
} from "app/shared/models/Listados.model";
import { HelpersService } from "app/shared/services/helpers.service";
import Swal from "sweetalert2";
import { catchError } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { Subscription, throwError } from "rxjs";
import { ReciboService } from "@app/shared/services/recibo.service";
import { CommunicationService } from "@app/shared/services/communication.service";
import { Listado } from "@app/shared/services/listados.service";
import { LogisticaService } from "@app/shared/services/logistica.service";

@Component({
  selector: "app-listado-devolucion-incentivos-supervisor",
  templateUrl: "./listado-devolucion-incentivos-supervisor.component.html",
  styleUrls: ["./listado-devolucion-incentivos-supervisor.component.scss"],
})
export class ListadoDevolucionIncentivosSupervisorComponent {
  dateIni: string;
  dateFin: string;
  allDates: boolean = false;
  listadoFilter: FiltrosList = {
    link: null,
    estado: 1,
    // disablePaginate: "true",
  };

  listadoData: ListadoModel<any>;
  Facturas: any[];
  Factura: any;

  isLoad: boolean;
  userStore: Usuario[];
  @ViewChild("mySelect") mySelect!: ElementRef<HTMLSelectElement>;

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    public _AuthService: AuthService,
    public _ReciboService: ReciboService,
    private NgbModal: NgbModal,
    private _HelpersService: HelpersService,
    private _Logistica: LogisticaService,
    private _Listado: Listado
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
    };

    this._Logistica.devolucionesSupervisor(this.listadoFilter).subscribe(
      (paginacion: ListadoModel<any>) => {
        this.listadoData = paginacion;
        console.log(this.listadoData);
        this.Facturas = [...paginacion.data];
        this.isLoad = false;
      },
      (error) => {
        this.isLoad = false;
      }
    );
    this.NgbModal.dismissAll();
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

  toggleAccordion(index: number) {
    const element = document.getElementById(`accordion${index}`);
    if (element) {
      element.classList.toggle("show");
    }
  }

  agregar(factura: any) {
    console.log(factura);
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    })
      .fire({
        title: "¿Deseas agregar esta deducción al incentivo del supervisor?",
        text: `Se agregara una deducción de $${factura.monto_devueltos} en el mes actual`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#51cbce",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
      })
      .then((result) => {
        if (result.isConfirmed) {
          Swal.mixin({
            customClass: {
              container: this.themeSite, // Clase para el modo oscuro
            },
          }).fire({
            title: "Agregando deducción",
            text: "Esto puede demorar un momento.",
            timerProgressBar: true,
            allowEscapeKey: false,
            allowOutsideClick: false,
            allowEnterKey: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          this._Logistica
            .crearDevolucionesSupervisor({
              factura_id: factura.factura_id,
              monto: factura.monto,
              saldo_restante: factura.saldo_restante,
              origen: factura.origen,
              monto_devueltos: factura.monto_devueltos,
              productos: factura.productos,
            })
            .pipe(
              catchError((http: HttpErrorResponse) => {
                // console.log(http);
                let error = http.error as { mensaje: string };
                if (error.mensaje) {
                  Swal.mixin({
                    customClass: {
                      container: this.themeSite, // Clase para el modo oscuro
                    },
                  })
                    .fire({
                      text: error.mensaje,
                      icon: "warning",
                    })
                    .then((result) => {
                      // this.NgbModal.dismissAll();
                    });
                }

                return throwError(http);
              })
            )
            .subscribe((data) => {
              console.log("[response]", data);

              Swal.mixin({
                customClass: {
                  container: this.themeSite, // Clase para el modo oscuro
                },
              })
                .fire({
                  text: "Deducción cargada con éxito",
                  icon: "success",
                })
                .then((result) => {
                  if (result.isConfirmed) {
                    this.NgbModal.dismissAll();
                    location.reload();
                  }
                });
            });
        }
      });
  }

  
  openFiltros(content: any) {
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

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
