import { Component } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "app/auth/login/service/auth.service";
import { InversionResponse } from "app/shared/models/Inversion";
import { FiltrosList, ListadoModel } from "app/shared/models/Listados.model";
import { FinanzasService } from "app/shared/services/finanzas.service";
import { HelpersService } from "app/shared/services/helpers.service";
import logger from "app/shared/utils/logger";
import { map } from "rxjs/operators";
import Swal from "sweetalert2";

@Component({
  selector: "app-inversion-list",
  templateUrl: "./inversion-list.component.html",
  styleUrls: ["./inversion-list.component.scss"],
})
export class InversionListComponent {
  dateIni: string;
  dateFin: string;
  allDates: boolean = true;
  listadoFilter: FiltrosList = {
    link: null,
    estado: 1,
    // disablePaginate: "true",
  };

  listadoData: ListadoModel<InversionResponse>;
  Inversiones: InversionResponse[];

  isLoad: boolean;

  constructor(
    public _FinanzasService: FinanzasService,
    public _AuthService: AuthService,
    private NgbModal: NgbModal,
    private _HelpersService: HelpersService
  ) {}

  ngOnInit(): void {
    this.setCurrentDate();
    this.asignarValores();
  }

  asignarValores() {
    this.isLoad = true;

    this._FinanzasService
      .getInversiones(this.listadoFilter)
      .pipe(
        map((pagination: ListadoModel<InversionResponse>) => {
          pagination.data = pagination.data.map((producto) => {
            return {
              ...producto,
              number_item: String(producto.id).padStart(4, "0"),
            };
          });
          return pagination;
        })
      )
      .subscribe(
        (Paginacion: ListadoModel<InversionResponse>) => {
          console.log(Paginacion);
          this.listadoData = { ...Paginacion };
          this.Inversiones = [...Paginacion.data];
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

  eliminar(data: InversionResponse) {
    // console.log(data);
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta inversión se eliminará y no podrás recuperarla.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#51cbce",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this._FinanzasService.deleteInversion(data.id).subscribe((data) => {
          // this.Frecuencias = this.Frecuencias.filter(categoria => categoria.id != id)
          this.asignarValores();
          Swal.fire({
            text: data[0],
            icon: "success",
          });
        });
      }
    });
  }

  bloquear(data: InversionResponse) {
    // console.log(data);
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Una vez cerrada solo podras visualizar los datos.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#51cbce",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this._FinanzasService
          .changeValueInversion(data.id, {
            estatus_cierre: 1,
          })
          .subscribe((data) => {
            // this.Frecuencias = this.Frecuencias.filter(categoria => categoria.id != id)
            this.asignarValores();
            Swal.fire({
              text: data[0],
              icon: "success",
            });
          });
      }
    });
  }

  limpiarFiltros() {
    this.setCurrentDate();
    this.allDates = true;

    this.asignarValores();
    this.NgbModal.dismissAll();
  }
}
