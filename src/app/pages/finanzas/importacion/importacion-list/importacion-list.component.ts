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
import { ImportacionNotaService } from "@app/shared/services/importacion-nota.service";
import { HelpersService } from "app/shared/services/helpers.service";
import Swal from "sweetalert2";
import { ImportacionResponse } from "app/shared/models/Importacion.model";
import { Subscription } from "rxjs";
import { CommunicationService } from "@app/shared/services/communication.service";

@Component({
  selector: "app-importacion-list",
  templateUrl: "./importacion-list.component.html",
  styleUrls: ["./importacion-list.component.scss"],
})
export class ImportacionListComponent {
  dateIni: string;
  dateFin: string;
  allDates: boolean = true;
  listadoFilter: FiltrosList = {
    link: null,
    estado: 1,
    // disablePaginate: "true",
  };

  listadoData: ListadoModel<ImportacionResponse>;
  Importaciones: ImportacionResponse[];

  // Nota modal
  notaValue: number = null;
  selectedImportacionId: number = null;

  isLoad: boolean;

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    public _FinanzasService: FinanzasService,
    public _AuthService: AuthService,
    private NgbModal: NgbModal,
    private _HelpersService: HelpersService,
    private _ImportacionNotaService: ImportacionNotaService
  ) {}

  ngOnInit(): void {
    this.setCurrentDate();
    this.asignarValores();

    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
  }

  asignarValores(isBtnFilter: boolean = false) {
    this.isLoad = true;

    if (isBtnFilter) {
      this.listadoFilter = {
        ...this.listadoFilter,
        dateIni: this.dateIni,
        dateFin: this.dateFin,
        allDates: this.allDates,
      };
    }
    this._FinanzasService.getImportacion(this.listadoFilter).subscribe(
      (Paginacion: ListadoModel<ImportacionResponse>) => {
        console.log(Paginacion);
        this.listadoData = { ...Paginacion };
        this.Importaciones = [...Paginacion.data];
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
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
    }).result.then(
      (result) => {},
      (reason) => {}
    );
  }

  openNotaModal(importacion: any, content: any) {
    // Guardamos la importación seleccionada y el valor actual si lo tiene
    this.selectedImportacionId = importacion.id;
    // Soportar distintos shapes: nota puede ser number o objeto { valor }
    if (importacion.nota != null) {
      this.notaValue = importacion.nota.monto;
    } else {
      this.notaValue = null;
    }

    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
    }).result.then(
      (result) => {},
      (reason) => {}
    );
  }

  guardarNota(modal: any) {
    if (this.selectedImportacionId == null) return;

    if (this.notaValue == null || isNaN(this.notaValue)) {
      Swal.fire({
        text: "Ingrese un valor numérico válido para la nota.",
        icon: "warning",
      });
      return;
    }

    Swal.mixin({
      customClass: {
        container: this.themeSite,
      },
    }).fire({
      title: "Guardando nota",
      text: "Espere por favor…",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this._ImportacionNotaService
      .createNota(this.selectedImportacionId, this.notaValue)
      .subscribe(
        (res) => {
          modal.close();
          this.asignarValores();
          Swal.mixin({
            customClass: {
              container: this.themeSite,
            },
          }).fire({
            text: Array.isArray(res) ? res[0] : "Nota creada",
            icon: "success",
          });
        },
        (err) => {
          Swal.fire({ text: "Error al guardar la nota.", icon: "error" });
        }
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

  eliminar(data: InversionResponse) {
    // console.log(data);
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    })
      .fire({
        title: "¿Estás seguro?",
        text: "Esta importación se eliminará y no podrás recuperarla.",
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
            title: "Eliminando la importación",
            text: "Esto puede demorar un momento.",
            timerProgressBar: true,
            allowEscapeKey: false,
            allowOutsideClick: false,
            allowEnterKey: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          this._FinanzasService.deleteInversion(data.id).subscribe((data) => {
            // this.Frecuencias = this.Frecuencias.filter(categoria => categoria.id != id)
            this.asignarValores();
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

  bloquear(data: InversionResponse) {
    // console.log(data);
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    })
      .fire({
        title: "¿Estás seguro?",
        text: "Una vez cerrada solo podras visualizar los datos.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#51cbce",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
      })
      .then((result) => {
        if (result.isConfirmed) {
          this._FinanzasService
            .changeValueInversion(data.id, {
              estatus_cierre: 1,
            })
            .subscribe((data) => {
              // this.Frecuencias = this.Frecuencias.filter(categoria => categoria.id != id)
              this.asignarValores();
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

  limpiarFiltros() {
    this.allDates = true;
    this.setCurrentDate();

    this.asignarValores();
    this.NgbModal.dismissAll();
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
