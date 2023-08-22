import { Component, OnInit, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "app/auth/login/service/auth.service";
import { TypesFiltersForm } from "app/shared/models/FiltersForm";
import { CarteraDateBodyForm } from "app/shared/models/Logistica.model";
import { Usuario } from "app/shared/models/Usuario.model";
import { HelpersService } from "app/shared/services/helpers.service";
import { LogisticaService } from "app/shared/services/logistica.service";
import { RememberFiltersService } from "app/shared/services/remember-filters.service";
import { UsuariosService } from "app/shared/services/usuarios.service";
import { environment } from "environments/environment";
import { merge, Observable, OperatorFunction, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import Swal from "sweetalert2";

@Component({
  selector: "app-productos-vendedor",
  templateUrl: "./productos-vendedor.component.html",
  styleUrls: ["./productos-vendedor.component.css"],
})
export class ProductosVendedorComponent implements OnInit {
  page = 1;
  pageSize = environment.PageSize;
  collectionSize = 0;
  isLoad: boolean;
  isAdmin: boolean;
  isSupervisor: boolean;

  Datos: any[];
  total = 0;

  filtros: any = {};
  dateIni: string;
  dateFin: string;
  allDates: boolean = false;
  // user:number

  @ViewChild("instance", { static: true }) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  USersNames: string[] = [];
  userId: number;
  userIdString: string;
  userStore: Usuario[];

  FilterSection: TypesFiltersForm = "productosVendidosFilter";

  constructor(
    private _AuthService: AuthService,
    private _LogisticaService: LogisticaService,
    private NgbModal: NgbModal,
    private _HelpersService: HelpersService,
    private _UsuariosService: UsuariosService,
    private _RememberFiltersService: RememberFiltersService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor();
    this.userId = Number(this._AuthService.dataStorage.user.userId);

    this.aplicarFiltros();
  }

  asignarValores() {
    this.isLoad = true;
    let bodyForm: CarteraDateBodyForm = {
      dateIni: this.filtros.dateIni,
      dateFin: this.filtros.dateFin,
      userId: Number(this.filtros.userId),
      tipo_venta: this.filtros.tipo_venta,
      status_pagado: this.filtros.status_pagado,
      allDates: this.filtros.allDates,
    };

    this._LogisticaService.getProductosVendedidos(bodyForm).subscribe(
      (data: any) => {
        console.log(data);
        this.Datos = data;
        let acumuladorTotalProductos = 0;
        data.map((producto) => {
          acumuladorTotalProductos += producto.totalProductos;
        });

        this.total = acumuladorTotalProductos;

        this.isLoad = false;
      },
      (error) => {
        this.isLoad = false;
      }
    );
  }

  getUsers() {
    this._UsuariosService.getUsuario().subscribe((usuarios: Usuario[]) => {
      this.userStore = usuarios;
      this.USersNames = usuarios.map(
        (usuario) => `${usuario.id} - ${usuario.name} ${usuario.apellido}`
      );

      this.resetUser();
    });
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

    this.filtros = {
      dateIni: this.dateIni,
      dateFin: this.dateFin,
    };
  }

  openFiltros(content: any) {
    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
    }).result.then(
      (result) => {},
      (reason) => {}
    );
  }

  resetUser() {
    // this.userId = Number(this._AuthService.dataStorage.user.userId);
    // this.userStore.map((usuario) => {
    //   if (usuario.id == this.userId) {
    //     this.userIdString = `${usuario.id} - ${usuario.name} ${usuario.apellido}`;
    //   }
    // });
  }

  limpiarFiltros() {
    this.setCurrentDate();

    this.allDates = false;

    if (this.isAdmin || this.isSupervisor) this.resetUser();

    this._RememberFiltersService.deleteFilterStorage(this.FilterSection);
    this.aplicarFiltros();
  }

  aplicarFiltros(submit: boolean = false) {
    let filtrosStorage = this._RememberFiltersService.getFilterStorage();

    if (filtrosStorage.hasOwnProperty(this.FilterSection) && !submit) {
      this.filtros = { ...filtrosStorage[this.FilterSection] };

      this.dateIni = this.filtros.dateIni;
      this.dateFin = this.filtros.dateFin;
      this.userId = Number(this.filtros.userId);
      this.allDates = this.filtros.allDates;
    } else {
      if (!submit) {
        this.userId = Number(this._AuthService.dataStorage.user.userId);
      }
      if (!this.dateIni || !this.dateFin) this.setCurrentDate(); // si las fechas estan vacias, se setean las fechas men actual

      if (
        this._HelpersService.siUnaFechaEsIgualOAnterior(
          this.dateIni,
          this.dateFin
        )
      )
        this.setCurrentDate(); // si las fecha inicial es mayor a la final, se setean las fechas mes actual

      this.filtros = {
        dateIni: this.dateIni,
        dateFin: this.dateFin,
        userId: Number(this.userId),
        allDates: this.allDates,
      };
    }

    this._RememberFiltersService.setFilterStorage(this.FilterSection, {
      ...this.filtros,
    });
    this.asignarValores();
  }

  search: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$).pipe(
      map((term) =>
        (term === ""
          ? [...this.USersNames]
          : [...this.USersNames].filter(
              (v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1
            )
        ).slice(0, 10)
      )
    );
  };

  descargarPDF() {
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${day}-${month}-${year}`;

    Swal.fire({
      title: "Descargando el archivo",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this._LogisticaService
      .getProductosVendidosPDF({
        dateIni: this.dateIni,
        dateFin: this.dateFin,
        allDates: this.allDates,
      })
      .subscribe((data) => {
        // console.log(data);
        this._HelpersService.downloadFile(
          data,
          `productos_vendidos_${currentDate}`
        );
        Swal.fire("", "Descarga Completada", "success");
      });
  }

  descargarPDFUser(user: Usuario) {
    console.log(user);

    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${day}-${month}-${year}`;

    Swal.fire({
      title: "Descargando el archivo",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this._LogisticaService
      .getProductosVendidosPDFUsuario({
        dateIni: this.dateIni,
        dateFin: this.dateFin,
        allDates: this.allDates,
        userId: user.id,
      })
      .subscribe((data) => {
        // console.log(data);
        this._HelpersService.downloadFile(
          data,
          `productos_vendidos_${currentDate}`
        );
        Swal.fire("", "Descarga Completada", "success");
      });
  }

  descargarPDFSupervisor(user: Usuario) {
    console.log(user);

    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${day}-${month}-${year}`;

    Swal.fire({
      title: "Descargando el archivo",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this._LogisticaService
      .getProductosVendidosPDFSupervisor({
        dateIni: this.dateIni,
        dateFin: this.dateFin,
        allDates: this.allDates,
        userId: user.id,
      })
      .subscribe((data) => {
        // console.log(data);
        this._HelpersService.downloadFile(
          data,
          `productos_vendidos_${currentDate}`
        );
        Swal.fire("", "Descarga Completada", "success");
      });
  }
}
