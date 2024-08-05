import { Component, OnInit } from "@angular/core";
import {
  FiltrosList,
  Link,
  ListadoModel,
} from "@app/shared/models/Listados.model";
import { CommunicationService } from "@app/shared/services/communication.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DevolucionProducto } from "app/shared/models/DevolucionProducto.model";
import { TablasService } from "app/shared/services/tablas.service";
import { environment } from "environments/environment";
import Swal from "sweetalert2";
import { DevolucionProductoService } from "../../services/devolucion-producto.service";
import { Subscription } from "rxjs";
import { HelpersService } from "@app/shared/services/helpers.service";

@Component({
  selector: "app-devolucion-producto-list",
  templateUrl: "./devolucion-producto-list.component.html",
  styleUrls: ["./devolucion-producto-list.component.css"],
})
export class DevolucionProductoListComponent implements OnInit {
  page = 1;
  pageSize = environment.PageSize;
  collectionSize = 0;
  DevolucionProductos: DevolucionProducto[];
  isLoad: boolean;
  listadoData: ListadoModel<DevolucionProducto>;
  listadoFilter: FiltrosList = { link: null };

  dateIni: string;
  dateFin: string;
  allDates: boolean = false;

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    private _DevolucionProductoService: DevolucionProductoService,
    private _TablasService: TablasService,
    private NgbModal: NgbModal,
    private _HelpersService: HelpersService
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

  asignarValores() {
    this.isLoad = true;
    this.listadoFilter = {
      ...this.listadoFilter,
      despachado: 0,
      estado: 1,
      disablePaginate: 0,
      dateIni: this.dateIni,
      dateFin: this.dateFin,
      allDates: this.allDates,
    };
    this.NgbModal.dismissAll()
    this._DevolucionProductoService
      .getProductosDevueltos({ ...this.listadoFilter })
      .subscribe(
        (Paginacion: any) => {
          console.log(Paginacion);
          this.DevolucionProductos = [...Paginacion.data];
          // this._TablasService.datosTablaStorage = [...DevolucionProducto];
          // this._TablasService.total = DevolucionProducto.length;
          // this._TablasService.busqueda = "";
          this.listadoData = { ...Paginacion };

          // this.refreshCountries();
          this.isLoad = false;
        },
        (error) => {
          this.isLoad = false;
        }
      );
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

  newPage(link: Link) {
    if (link.url == null) return;
    // console.log(link);

    this.listadoFilter.link = link.url;

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

  limpiarFiltros() {
    this.setCurrentDate();

    this.allDates = false;

    // this._RememberFiltersService.deleteFilterStorage(this.FilterSection);
    this.asignarValores();

    // console.log(this.filtros);
  }

  refreshCountries() {
    // this._TablasService.datosTablaStorage = [...this.DevolucionProducto].slice(
    //   (this.page - 1) * this.pageSize,
    //   (this.page - 1) * this.pageSize + this.pageSize
    // );
  }

  BuscarValor() {
    this.listadoFilter.link = null;
    this.asignarValores();
  }

  // eliminar(devolucion:DevolucionProducto){
  //   console.log(devolucion);
  //   Swal.mixin({
  //   customClass: {
  //     container: this.themeSite, // Clase para el modo oscuro
  //   },
  // }).fire({
  //     title: '¿Estás seguro?',
  //     text: "Esta devolución se eliminará y no podrás recuperarla.",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#51cbce',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Eliminar',
  //     cancelButtonText: 'Cancelar'
  //   }).then((result) => {
  //     if (result.isConfirmed) {

  //       this._DevolucionProductoService.deleteDevolucion(devolucion.id).subscribe((data)=>{
  //         this.DevolucionProducto = this.DevolucionProducto.filter(devolucionProducto => devolucionProducto.id != devolucion.id)
  //         this.refreshCountries()

  //         Swal.mixin({
  //   customClass: {
  //     container: this.themeSite, // Clase para el modo oscuro
  //   },
  // }).fire({
  //           text: data[0],
  //           icon: 'success',
  //         })
  //       })
  //     }
  //   })
  // }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
