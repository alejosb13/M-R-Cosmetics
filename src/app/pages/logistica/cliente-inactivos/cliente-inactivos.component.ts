import { Component, OnInit, ViewChild } from "@angular/core";
import { Cliente } from "@app/shared/models/Cliente.model";
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
  filter,
  map,
} from "rxjs/operators";
import Swal from "sweetalert2";

@Component({
  selector: "app-cliente-inactivos",
  templateUrl: "./cliente-inactivos.component.html",
  styleUrls: ["./cliente-inactivos.component.css"],
})
export class ClienteInactivosComponent implements OnInit {
  page = 1;
  pageSize = environment.PageSize;
  collectionSize = 0;
  isLoad: boolean;
  isAdmin: boolean;
  isSupervisor: boolean;

  tipos: number = 0;
  diasCobros: string[] = [];

  userQuery: Usuario;
  Data: any[];
  total = 0;
  totalContado = 0;
  totalCredito = 0;
  filtros: any = {};
  dateIni: string;
  dateFin: string;
  tipoVenta = 1; //credito
  status_pagado = 0; // por pagar
  allDates: boolean = false;
  // numDesde:number
  // numHasta:number
  numRecibo: number;
  allNumber: boolean = true;
  // user:number

  @ViewChild("instance", { static: true }) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  USersNames: string[] = [];
  userId: number;
  userIdString: string;
  userStore: Usuario[];

  FilterSection: TypesFiltersForm = "clientesInactivosFilter";

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    private _TablasService: TablasService,
    private _AuthService: AuthService,
    private _LogisticaService: LogisticaService,
    private NgbModal: NgbModal,
    private _HelpersService: HelpersService,
    private _UsuariosService: UsuariosService,
    private _RememberFiltersService: RememberFiltersService,
    private _Listado: Listado,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor();
    this.userId = Number(this._AuthService.dataStorage.user.userId);

    this.userId = 0;
    if (!this.isAdmin || !this.isSupervisor) {
      this.userId = Number(this._AuthService.dataStorage.user.userId);
    }

    if (this.isAdmin || this.isSupervisor) {
      this.getUsers();
    }

    // this.setCurrentDate();
    this.aplicarFiltros();
    // this.asignarValores()

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
      allNumber: this.filtros.allNumber,
      tipos: this.filtros.tipos,
      // numDesde:this.filtros.numDesde,
      // numHasta:this.filtros.numHasta
      // numRecibo: Number(this.filtros.numRecibo),
      diasCobros: this.diasCobros,
    };

    this._LogisticaService.getClientesInactivos(bodyForm).subscribe(
      (data: any) => {
        // console.log(recibos);
        data.map((cliente) => {
          const regex = /,/g;
          cliente.dias_cobro = cliente.dias_cobro.replace(regex, " - ");
          return cliente;
        });

        this.Data = data;
        this._TablasService.datosTablaStorage = data;
        this._TablasService.total = data.length;
        this._TablasService.busqueda = "";

        this.total = data.length;

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
    let camposPorFiltrar: any[] = [
      ["nombreCompleto"],
      ["nombreEmpresa"],
      ["cedula"],
      ["direccion_casa"],
      ["direccion_negocio"],
      // ['frecuencia','descripcion'],
      ["categoria", "descripcion"],
      // ['user','name'],
      // ['user','apellido'],
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
    console.log(this.userId);
    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
    }).result.then(
      (result) => {},
      (reason) => {}
    );
  }

  resetUser() {
    this.userId = 0;
    if (!this.isAdmin) {
      this.userId = Number(this._AuthService.dataStorage.user.userId);
    }

    this.userStore.map((usuario) => {
      if (usuario.id == this.userId) {
        this.userIdString = `${usuario.id} - ${usuario.name} ${usuario.apellido}`;
      }
    });
  }

  limpiarFiltros() {
    this.setCurrentDate();

    // this.userId = Number(this._AuthService.dataStorage.user.userId);
    this.userId = 0;
    if (!this.isAdmin) {
      this.userId = Number(this._AuthService.dataStorage.user.userId);
    }

    this.clearDiasCobros();
    this.diasCobros = [];

    // this.tipoVenta = 1
    // this.status_pagado = 0 // por pagar
    // this.numDesde = 0
    // this.numHasta = 0
    this.tipos = 0;
    this.numRecibo = 0;
    this.allNumber = true;
    this.allDates = false;

    if (this.isAdmin) this.resetUser();

    this._RememberFiltersService.deleteFilterStorage(this.FilterSection);
    this.aplicarFiltros();
    // console.log(this.filtros);
  }

  aplicarFiltros(submit: boolean = false) {
    let filtrosStorage = this._RememberFiltersService.getFilterStorage();

    if (filtrosStorage.hasOwnProperty(this.FilterSection) && !submit) {
      this.filtros = { ...filtrosStorage[this.FilterSection] };

      this.dateIni = this.filtros.dateIni;
      this.dateFin = this.filtros.dateFin;
      this.userId = Number(this.filtros.userId);
      this.allDates = this.filtros.allDates;
      this.allNumber = this.filtros.allNumber;
      this.numRecibo = this.filtros.numRecibo;
      this.tipos = this.filtros.tipos;
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
        allNumber: this.allNumber,
        tipos: Number(this.tipos),
        // numDesde: this.numDesde ? this.numDesde : 0,
        // numHasta: this.numHasta ? this.numHasta : 0,
        numRecibo: this.numRecibo ? this.numRecibo : 0,
      };
    }

    this._RememberFiltersService.setFilterStorage(this.FilterSection, {
      ...this.filtros,
    });
    this.asignarValores();
    this.NgbModal.dismissAll();
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

  descargarPDF() {
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
    let bodyForm: CarteraDateBodyForm = {
      dateIni: this.filtros.dateIni,
      dateFin: this.filtros.dateFin,
      userId: Number(this.filtros.userId),
      tipo_venta: this.filtros.tipo_venta,
      status_pagado: this.filtros.status_pagado,
      allDates: this.filtros.allDates,
      allNumber: this.filtros.allNumber,
      // numDesde:this.filtros.numDesde,
      // numHasta:this.filtros.numHasta
      numRecibo: Number(this.filtros.numRecibo),
    };
    this._LogisticaService
      .getClientesInactivosPDF(bodyForm)
      .subscribe((data) => {
        // console.log(data);
        this._HelpersService.downloadFile(
          data,
          `Clientes_inactivos_${
            this.userId
          }_${this._HelpersService.changeformatDate(
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

  cortarLetrasYMayuscula(
    palabra: string,
    posicionIni: number,
    posicionfin: number
  ) {
    let texto = palabra.slice(posicionIni, posicionfin);

    return `${texto.charAt(posicionIni).toUpperCase()}${texto.slice(1)}`;
  }

  changeDiasCobros(event: HTMLInputElement) {
    // console.log(this.diasCobros);
    if (event.checked) {
      this.diasCobros = [...this.diasCobros, event.value];
    } else {
      this.diasCobros = this.diasCobros.filter((dia) => dia != event.value);
    }
    // console.log(this.diasCobros);
  }

  existeDiaDeCobroEnFiltro(dia: string) {
    return this.diasCobros.some((diaCobro) => diaCobro == dia);
  }

  clearDiasCobros() {
    let element = document.getElementById("diasCobrosElement") as HTMLElement;
    let lisInputs = element.getElementsByTagName("input");
    Array.from(lisInputs).map((input: HTMLInputElement) => {
      input.checked = false;
    });
  }

  SetNota(event: HTMLInputElement, cliente: Cliente) {
    // console.log(event.value);
    console.log(cliente.id);
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    }).fire({
      title: "Cargando la observación",
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
      .clientesInactivosNotas({
        cliente_id: cliente.id,
        tipos: Number(event.value),
      })
      .subscribe(
        (data) => {
          console.log(data);
          Swal.mixin({
            customClass: {
              container: this.themeSite, // Clase para el modo oscuro
            },
          }).fire({
            text: "Observación cargada con éxito",
            icon: "success",
          });
        },
        (error) => {
          Swal.mixin({
            customClass: {
              container: this.themeSite, // Clase para el modo oscuro
            },
          }).fire({
            text: "Error",
            icon: "error",
          });
        }
      );
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
