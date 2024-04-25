import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
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

  isLoad: boolean;
  isAdmin: boolean;
  isSupervisor: boolean;
  userId: number;
  estado: number = 1;

  idUsuario: number;

  categorias: Categoria[];
  categoriaId: number = 0;

  userIdString: string;
  userStore: Usuario[];
  USersNames: string[] = [];

  diasCobros: string[] = [];

  dateIni: string;
  dateFin: string;
  allDates: boolean = true;

  roleName: string;
  listadoData: ListadoModel<Cliente>;
  listadoFilter: FiltrosList = { link: null };

  FilterSection: TypesFiltersForm = "clientesHistorialFilter";

  private Subscription = new Subscription();

  daysOfWeek: string[];

  constructor(
    private _Listado: Listado,
    private _AuthService: AuthService,
    private NgbModal: NgbModal,
    private _UsuariosService: UsuariosService,
    private _RememberFiltersService: RememberFiltersService,
    private _HelpersService: HelpersService,
    private _ClientesService: ClientesService,
    private _CategoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor();
    this.roleName = String(this._AuthService.dataStorage.user.roleName);

    this.daysOfWeek = this._HelpersService.DaysOfTheWeek;

    this.setCurrentDate();
    this.getUsers();
    this.getCategoria();
    this.aplicarFiltros();
    // this.limpiarFiltros();
  }

  getUsers() {
    this._UsuariosService.getUsuario().subscribe((usuarios: Usuario[]) => {
      this.userStore = usuarios;
      this.USersNames = usuarios.map(
        (usuario) => `${usuario.id} - ${usuario.name} ${usuario.apellido}`
      );
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
    this._Listado.registerClientesPDF(this.listadoFilter).subscribe((data) => {
      // console.log(data);
      this._HelpersService.downloadFile(data, `Detalle_Factura_${currentDate}`);
      Swal.fire("", "Descarga Completada", "success");
    });
  }

  descargarCSV() {
    this._Listado.registerClientesCSV(this.listadoFilter);
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

  getCategoria() {
    this._CategoriaService
      .getCategoria()
      .subscribe((categorias: Categoria[]) => {
        this.categorias = categorias;
      });
  }

  asignarValores() {
    this.isLoad = true;

    this.listadoFilter = {
      ...this.listadoFilter,
      roleName: this.roleName,
      estado: this.estado,
    };

    let Subscription = this._Listado.clienteList(this.listadoFilter).subscribe(
      (Paginacion: ListadoModel<Cliente>) => {
        this.listadoData = { ...Paginacion };
        this.Clientes = Paginacion.data.map((cliente) => {
          let formatDiaCobro = cliente.dias_cobro.split(",");
          let htmlCobro = ``;
          formatDiaCobro.map((dia) => {
            htmlCobro += `- ${dia.charAt(0).toUpperCase() + dia.slice(1)} <br>`; // Agrego listado salto de linea y primera letra mayuscula
          });
          cliente.dias_cobro = htmlCobro;

          return cliente;
        });

        // this.Clientes = [...Paginacion.data];
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
    this.clearDiasCobros();
    // this.allDates = false;
    this.diasCobros = [];
    (this.estado = 1),
      this._RememberFiltersService.deleteFilterStorage(this.FilterSection);
    this.aplicarFiltros();

    // console.log(this.filtros);
  }

  aplicarFiltros(submit: boolean = false) {
    // console.log(this.allDates);
    let filtrosStorage = this._RememberFiltersService.getFilterStorage();

    // if (filtrosStorage.hasOwnProperty(this.FilterSection) && !submit) {
    //   // solo al iniciar con datos en storage
    //   this.listadoFilter = { ...filtrosStorage[this.FilterSection] };
    //   this.userId = Number(this.listadoFilter.userId);
    //   this.categoriaId = Number(this.listadoFilter.categoriaId);
    //   this.dateIni = this.listadoFilter.dateIni;
    //   this.dateFin = this.listadoFilter.dateFin;
    //   this.allDates = this.listadoFilter.allDates;
    //   this.diasCobros = this.listadoFilter.diasCobros;
    // } else {
    if (!submit) {
      console.log(this.userId);

      this.userId = Number(this._AuthService.dataStorage.user.userId);
      // this.userId = 0;
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
      diasCobros: this.diasCobros,
    };
    // }

    this._RememberFiltersService.setFilterStorage(this.FilterSection, {
      ...this.listadoFilter,
    });
    this.asignarValores();
    this.NgbModal.dismissAll();
  }

  eliminar({ id, estado }: Cliente) {
    // console.log(id);

    Swal.fire({
      title: "¿Estás seguro?",
      text:
        estado == 1
          ? "Este cliente se eliminará."
          : "Este cliente se restaurara.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#51cbce",
      cancelButtonColor: "#d33",
      confirmButtonText: estado == 1 ? "Eliminar" : "Restaurar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Eliminando el cliente",
          text: "Esto puede demorar un momento.",
          timerProgressBar: true,
          allowEscapeKey: false,
          allowOutsideClick: false,
          allowEnterKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        this._ClientesService.deleteCliente(id).subscribe((data) => {
          if (estado == 1) {
            this.Clientes = this.Clientes.filter((cliente) => cliente.id != id);

            Swal.fire({
              text: data[0],
              icon: "success",
            });
          }
          if (estado == 0) {
            this.Clientes = this.Clientes.map((cliente) => {
              // console.log(estado);
              
              if (cliente.id == id) return { ...cliente, estado: 1 };
              return cliente;
            });

            Swal.fire({
              text: data[0],
              icon: "success",
            });
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.Subscription.unsubscribe();
  }
}
