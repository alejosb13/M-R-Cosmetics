import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "app/auth/login/service/auth.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { Listado } from "app/shared/services/listados.service";
import {
  FiltrosList,
  Link,
  ListadoModel,
} from "app/shared/models/Listados.model";
import { ReciboHistorial } from "app/shared/models/ReciboHistorial.model";
import { Usuario } from "app/shared/models/Usuario.model";
import { TypesFiltersForm } from "app/shared/models/FiltersForm";
import { UsuariosService } from "app/shared/services/usuarios.service";
import { RememberFiltersService } from "app/shared/services/remember-filters.service";
import { HelpersService } from "app/shared/services/helpers.service";
import { ClientesService } from "app/shared/services/clientes.service";
import { Cliente } from "app/shared/models/Cliente.model";
import { Categoria } from "app/shared/models/Categoria.model";
import { CategoriaService } from "app/shared/services/categoria.service";

@Component({
  selector: "app-clientes",
  templateUrl: "./clientes.component.html",
  styleUrls: ["./clientes.component.css"],
})
export class ClientesComponent implements OnInit {
  Clientes: Cliente[];

  numeroRecibo: string = "";

  isLoad: boolean;
  isAdmin: boolean;
  isSupervisor: boolean;
  userId: number = 0;

  idUsuario: number;

  categorias: Categoria[];
  categoriaId: number = 0;

  userIdString: string;
  userStore: Usuario[];
  USersNames: string[] = [];

  dateIni: string;
  dateFin: string;
  allDates: boolean = true;

  roleName: string;
  listadoData: ListadoModel<Cliente>;
  listadoFilter: FiltrosList = { link: null };

  FilterSection: TypesFiltersForm = "clientesHistorialFilter";

  private Subscription = new Subscription();

  constructor(
    private _Listado: Listado,
    private _AuthService: AuthService,
    private NgbModal: NgbModal,
    private _UsuariosService: UsuariosService,
    private _RememberFiltersService: RememberFiltersService,
    private _HelpersService: HelpersService,
    private _ClientesService: ClientesService,
    private _CategoriaService: CategoriaService,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor();
    this.roleName = String(this._AuthService.dataStorage.user.roleName);

    this.setCurrentDate();
    this.getUsers();
    this.getCategoria();
    this.aplicarFiltros();
  }

  getUsers() {
    this._UsuariosService.getUsuario().subscribe((usuarios: Usuario[]) => {
      this.userStore = usuarios;
      this.USersNames = usuarios.map(
        (usuario) => `${usuario.id} - ${usuario.name} ${usuario.apellido}`
      );
    });
  }

  getCategoria() {
    this._CategoriaService.getCategoria().subscribe((categorias: Categoria[]) => {
      this.categorias = categorias;
    });
  }

  asignarValores() {
    this.isLoad = true;

    this.listadoFilter = {
      ...this.listadoFilter,
      roleName: this.roleName,
    };

    let Subscription = this._Listado.clienteList(this.listadoFilter).subscribe(
      (Paginacion) => {
        this.listadoData = { ...Paginacion };
        this.Clientes = [...Paginacion.data];
        this.isLoad = false;
      },
      (error) => {
        this.isLoad = false;
      }
    );
    this.Subscription.add(Subscription);
  }

  BuscarValor() {
    this.listadoFilter.link = null;
    this.asignarValores();
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

  newPage(link: Link) {
    if (link.url == null) return;
    // console.log(link);

    this.listadoFilter.link = link.url;

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
    };
  }

  limpiarFiltros() {
    this.setCurrentDate();

    // this.allDates = false;
    this.numeroRecibo = "";

    this._RememberFiltersService.deleteFilterStorage(this.FilterSection);
    this.aplicarFiltros();

    // console.log(this.filtros);
  }

  aplicarFiltros(submit: boolean = false) {
    // console.log(this.allDates);
    let filtrosStorage = this._RememberFiltersService.getFilterStorage();

    if (filtrosStorage.hasOwnProperty(this.FilterSection) && !submit) {
      // solo al iniciar con datos en storage
      this.listadoFilter = { ...filtrosStorage[this.FilterSection] };
      this.userId = Number(this.listadoFilter.userId);
      this.categoriaId = Number(this.listadoFilter.categoriaId);
      this.dateIni = this.listadoFilter.dateIni;
      this.dateFin = this.listadoFilter.dateFin;
      this.allDates = this.listadoFilter.allDates;
      this.numeroRecibo = this.listadoFilter.numeroRecibo;
    } else {
      if (!submit) {
        console.log(this.userId);

        // this.userId = Number(this._AuthService.dataStorage.user.userId);
        this.userId = 0;
        this.categoriaId = 0;
      }

      if (!this.dateIni || !this.dateFin) this.setCurrentDate(); // si las fechas estan vacias, se setean las fechas men actual

      if (
        this._HelpersService.siUnaFechaEsIgualOAnterior(
          this.dateIni,
          this.dateFin
        )
      )
        this.setCurrentDate(); // si las fecha inicial es mayor a la final, se setean las fechas mes actual
      this.listadoFilter = {
        ...this.listadoFilter,
        dateIni: this.dateIni,
        dateFin: this.dateFin,
        userId: this.userId,
        categoriaId: this.categoriaId,
        allDates: this.allDates,
        numeroRecibo: this.numeroRecibo,
      };
    }

    this._RememberFiltersService.setFilterStorage(this.FilterSection, {
      ...this.listadoFilter,
    });
    this.asignarValores();
  }

  eliminar({ id }: Cliente) {
    // console.log(id);
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Este cliente se eliminará y no podrás recuperarlo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#51cbce",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this._ClientesService.deleteCliente(id).subscribe((data) => {
          this.Clientes = this.Clientes.filter((cliente) => cliente.id != id);

          Swal.fire({
            text: data[0],
            icon: "success",
          });
        });
      }
    });
  }

  ngOnDestroy() {
    this.Subscription.unsubscribe();
  }
}
