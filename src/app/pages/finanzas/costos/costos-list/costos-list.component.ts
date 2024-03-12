import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/auth/login/service/auth.service';
import { InversionResponse } from 'app/shared/models/Inversion.model';
import { FiltrosList, Link, ListadoModel } from 'app/shared/models/Listados.model';
import { FinanzasService } from 'app/shared/services/finanzas.service';
import { HelpersService } from 'app/shared/services/helpers.service';
import Swal from 'sweetalert2';
import { ImportacionResponse } from '@app/shared/models/Importacion.model';;

@Component({
  selector: 'app-costos-list',
  templateUrl: './costos-list.component.html',
  styleUrls: ['./costos-list.component.scss']
})
export class CostosListComponent {
  dateIni: string;
  dateFin: string;
  allDates: boolean = false;
  listadoFilter: FiltrosList = {
    link: null,
    estado: 1,
    // disablePaginate: "true",
  };

  listadoData: ListadoModel<any>;
  Productos_Vendidos: any[];

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
      .getProductosVendidos(this.listadoFilter)
      .subscribe(
        (Paginacion: any) => {
          this.listadoData = Paginacion;
          console.log(this.listadoData);
          this.Productos_Vendidos = [...Paginacion.data];
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
    this.allDates = false;

    this.asignarValores();
    this.NgbModal.dismissAll();
  }

  newPage(link: Link) {
    if (link.url == null) return;
    // console.log(link);

    this.listadoFilter.link = link.url;

    this.asignarValores();
  }
}
