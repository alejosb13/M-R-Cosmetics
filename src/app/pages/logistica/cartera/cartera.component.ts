import { Component, OnInit, ViewChild } from "@angular/core";
import { CommunicationService } from "@app/shared/services/communication.service";
import { Listado } from "@app/shared/services/listados.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "app/auth/login/service/auth.service";
import { Factura } from "app/shared/models/Factura.model";
import { TypesFiltersForm } from "app/shared/models/FiltersForm";
import {
  CarteraDate,
  CarteraDateBodyForm,
} from "app/shared/models/Logistica.model";
import { Usuario } from "app/shared/models/Usuario.model";
import { HelpersService } from "app/shared/services/helpers.service";
import { LogisticaService } from "app/shared/services/logistica.service";
import { RememberFiltersService } from "app/shared/services/remember-filters.service";
import { TablasService } from "app/shared/services/tablas.service";
import { UsuariosService } from "app/shared/services/usuarios.service";
import { environment } from "environments/environment";
import {
  merge,
  Observable,
  OperatorFunction,
  Subject,
  Subscription,
} from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  map,
} from "rxjs/operators";
import Swal from "sweetalert2";

@Component({
  selector: "app-cartera",
  templateUrl: "./cartera.component.html",
  styleUrls: ["./cartera.component.css"],
})
export class CarteraComponent implements OnInit {
  page = 1;
  pageSize = environment.PageSize;
  collectionSize = 0;
  isLoad: boolean;
  isAdmin: boolean;
  isSupervisor: boolean;

  Data: Factura[];
  total = 0;
  recuperacion = 0;
  filtros: any = {};
  dateIni: string;
  dateFin: string;
  tipoVenta = 1; //credito
  status_pagado = 0; // por pagar
  allDates: boolean = false;
  // user:number

  @ViewChild("instance", { static: true }) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  USersNames: string[] = [];
  userId: number;
  userIdString: string;
  userStore: Usuario[];

  FilterSection: TypesFiltersForm = "carteraFilter";

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    private _TablasService: TablasService,
    private _AuthService: AuthService,
    private _LogisticaService: LogisticaService,
    private NgbModal: NgbModal,
    private _HelpersService: HelpersService,
    private _Listado: Listado,
    private _UsuariosService: UsuariosService,
    private _RememberFiltersService: RememberFiltersService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor();

    if (this.isAdmin || this.isSupervisor) {
      this.getUsers();
    }

    this.aplicarFiltros();

    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
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

    this._LogisticaService.getCarteraForDate(bodyForm).subscribe(
      (data: CarteraDate) => {
        // console.log(recibos);
        this.Data = [...data.factura];
        this._TablasService.datosTablaStorage = [...data.factura];
        this._TablasService.total = data.factura.length;
        this._TablasService.busqueda = "";

        this.total = data.total;
        this.recuperacion = data.recuperacion;

        this.refreshCountries();
        this.isLoad = false;
      },
      (error) => {
        this.isLoad = false;
      }
    );
  }

  refreshCountries() {
    this._TablasService.datosTablaStorage = [...this.Data].slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
  }

  BuscarValor() {
    // this._TablasService.buscar(this.Data)
    let camposPorFiltrar: any[] = [
      ["cliente", "nombreCompleto"],
      ["cliente", "nombreEmpresa"],
      ["user", "name"],
      ["user", "apellido"],
    ];
    this._TablasService.buscarEnCampos(this.Data, camposPorFiltrar);
    if (this._TablasService.busqueda == "") {
      this.refreshCountries();
    }
  }

  getUsers() {
    this._Listado
      .UsuariosList({
        disablePaginate: 1,
        estado: 1,
        // factura: 1,
        // recibo: 1,
        // recibosRangosSinTerminar: 1,
      }).subscribe((usuarios: Usuario[]) => {
      this.userStore = usuarios;
      this.USersNames = usuarios.map(
        (usuario) => `${usuario.id} - ${usuario.name} ${usuario.apellido}`
      );

      // this.resetUser()
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

  descargarPDF() {
    let bodyForm: CarteraDateBodyForm = {
      dateIni: this.filtros.dateIni,
      dateFin: this.filtros.dateFin,
      userId: Number(this.filtros.userId),
      tipo_venta: this.filtros.tipo_venta,
      status_pagado: this.filtros.status_pagado,
      allDates: this.filtros.allDates,
    };

    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    }).fire({
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
    this._LogisticaService.carteraPDF(bodyForm).subscribe((data) => {
      // console.log(data);
      this._HelpersService.downloadFile(
        data,
        `Cartera_${this.userId}_${this._HelpersService.changeformatDate(
          this._HelpersService.currentFullDay(),
          "MM/DD/YYYY HH:mm:ss",
          "DD-MM-YYYY_HH:mm:ss"
        )}`
      );
      Swal.mixin({
        customClass: {
          container: this.themeSite, // Clase para el modo oscuro
        },
      }).fire("", "Descarga Completada", "success");
    });
  }

  openFiltros(content: any) {
    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
    }).result.then(
      (result) => {},
      (reason) => {}
    );
  }

  resetUser() {
    this.userId = Number(this._AuthService.dataStorage.user.userId);
    this.userStore.map((usuario) => {
      if (usuario.id == this.userId) {
        this.userIdString = `${usuario.id} - ${usuario.name} ${usuario.apellido}`;
      }
    });
  }

  limpiarFiltros() {
    this.setCurrentDate();
    this.tipoVenta = 1;
    this.status_pagado = 0; // por pagar
    this.allDates = false;

    if (this.isAdmin || this.isSupervisor) this.resetUser();

    this._RememberFiltersService.deleteFilterStorage(this.FilterSection);
    this.aplicarFiltros();

    // console.log(this.filtros);
  }

  aplicarFiltros(submit: boolean = false) {
    // console.log(this.allDates);
    let filtrosStorage = this._RememberFiltersService.getFilterStorage();

    if (filtrosStorage.hasOwnProperty(this.FilterSection) && !submit) {
      // solo al iniciar con datos en storage
      this.filtros = { ...filtrosStorage[this.FilterSection] };

      this.dateIni = this.filtros.dateIni;
      this.dateFin = this.filtros.dateFin;
      this.userId = Number(this.filtros.userId);
      this.allDates = this.filtros.allDates;
      this.tipoVenta = this.filtros.tipo_venta;
      this.status_pagado = this.filtros.status_pagado;
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
        tipo_venta: this.tipoVenta,
        status_pagado: this.status_pagado,
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
    // const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
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

  dataChangedUser(element: string) {
    // console.log(element);
    if (element.includes("-")) {
      let split: string[] = element.split("-");
      let id = Number(split[0].trim());

      console.log("IdUsuario", id);
      this.userId = id;
      // this.userIdString = element
      // console.log(this.cliente);
    }
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
