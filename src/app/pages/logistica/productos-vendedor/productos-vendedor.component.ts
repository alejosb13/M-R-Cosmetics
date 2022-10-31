import { Component, OnInit, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "app/auth/login/service/auth.service";
import {
  CarteraDateBodyForm,
} from "app/shared/models/Logistica.model";
import { Usuario } from "app/shared/models/Usuario.model";
import { HelpersService } from "app/shared/services/helpers.service";
import { LogisticaService } from "app/shared/services/logistica.service";
import { UsuariosService } from "app/shared/services/usuarios.service";
import { environment } from "environments/environment";
import { merge, Observable, OperatorFunction, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";

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

  constructor(
    private _AuthService: AuthService,
    private _LogisticaService: LogisticaService,
    private NgbModal: NgbModal,
    private _HelpersService: HelpersService,
    private _UsuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this._AuthService.isAdmin();
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
    this.userId = Number(this._AuthService.dataStorage.user.userId);
    this.userStore.map((usuario) => {
      if (usuario.id == this.userId) {
        this.userIdString = `${usuario.id} - ${usuario.name} ${usuario.apellido}`;
      }
    });
  }

  limpiarFiltros() {
    this.setCurrentDate();

    if (this.isAdmin) this.resetUser();

    console.log(this.filtros);
  }

  aplicarFiltros() {
    console.log(this.allDates);

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
}
