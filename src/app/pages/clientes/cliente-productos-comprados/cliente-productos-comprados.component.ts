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
import { Usuario } from "app/shared/models/Usuario.model";
import { TypesFiltersForm } from "app/shared/models/FiltersForm";
import { UsuariosService } from "app/shared/services/usuarios.service";
import { RememberFiltersService } from "app/shared/services/remember-filters.service";
import { HelpersService } from "app/shared/services/helpers.service";
import { Abono } from "app/shared/models/Abono.model";
import { AbonoService } from "app/shared/services/abono.service";
import logger from "app/utils/logger";
import { TiposMetodos } from "app/shared/models/MetodoPago.model";
import { ActivatedRoute } from "@angular/router";
import { FacturaDetalle } from "app/shared/models/FacturaDetalle.model";

@Component({
  selector: 'app-cliente-productos-comprados',
  templateUrl: './cliente-productos-comprados.component.html',
  styleUrls: ['./cliente-productos-comprados.component.css']
})
export class ClienteProductosCompradosComponent implements OnInit {
  Productos: FacturaDetalle[];
  TiposMetodos = TiposMetodos;
  numeroRecibo: string = "";

  metodoPagoEditar: number ;
  detallePagoEditar: string = "";
  editarAbonoId: number;

  isLoad: boolean;
  isAdmin: boolean;
  isSupervisor: boolean;

  userId: number = 0;

  idUsuario: number;

  userIdString: string;
  userStore: Usuario[];
  USersNames: string[] = [];

  dateIni: string;
  dateFin: string;
  allDates: boolean = false;
  clienteId:number

  roleName: string;
  listadoData: ListadoModel<FacturaDetalle>;
  listadoFilter: FiltrosList = { link: null };

  FilterSection: TypesFiltersForm = "productosClientesFilter";

  private Subscription = new Subscription();

  constructor(
    private _Listado: Listado,
    private _AuthService: AuthService,
    private NgbModal: NgbModal,
    private _UsuariosService: UsuariosService,
    private _RememberFiltersService: RememberFiltersService,
    private _HelpersService: HelpersService,
    private _AbonoService: AbonoService,
    route: ActivatedRoute,
  ) {
    this.clienteId = Number(route.snapshot.params.id);

  }

  ngOnInit(): void {
    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor();
    this.roleName = String(this._AuthService.dataStorage.user.roleName);

    this.setCurrentDate();
    this.getUsers();
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

  asignarValores() {
    this.isLoad = true;

    this.listadoFilter = {
      ...this.listadoFilter,
      roleName: this.roleName,
      clienteId:this.clienteId,
      
    };

    let Subscription = this._Listado.clienteProductosCompradosList(this.listadoFilter).subscribe(
      (Paginacion) => {
        this.listadoData = { ...Paginacion };
        this.Productos = [...Paginacion.data];
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

    this.allDates = true;
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
      // this.userId = Number(this.listadoFilter.userId);
      this.dateIni = this.listadoFilter.dateIni;
      this.dateFin = this.listadoFilter.dateFin;
      // this.allDates = this.listadoFilter.allDates;
      this.allDates = this.listadoFilter.allDates;
      this.numeroRecibo = this.listadoFilter.numeroRecibo;
    } else {
      console.log(this.userId);
      if (!submit) {
        console.log(this.userId);

        // this.userId = Number(this._AuthService.dataStorage.user.userId);
        this.userId = 0;
        this.allDates = true;
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
        allDates: this.allDates,
        clienteId:this.clienteId
      };
    }

    this._RememberFiltersService.setFilterStorage(this.FilterSection, {
      ...this.listadoFilter,
    });
    this.asignarValores();
    this.NgbModal.dismissAll()
  }

  eliminar({ id }: Abono) {
    // console.log(id);
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Este abono se eliminará y no podrás recuperarlo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#51cbce",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this._AbonoService.deleteAbono(id).subscribe((data) => {
          // this.Abonos = this.Abonos.filter((abono) => abono.id != id);

          Swal.fire({
            text: data[0],
            icon: "success",
          });
        });
      }
    });
  }

  editarAbono(content: any, abono: Abono) {
    this.metodoPagoEditar = abono.metodo_pago.tipo;
    this.detallePagoEditar = abono.metodo_pago.detalle;
    this.editarAbonoId = abono.id;

    logger.log(abono);

    this.NgbModal.open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then((result) => {})
      .catch((err) => {});
  }

  editarAbonoEnviar() {
    logger.log({
      metodoPagoEditar: this.metodoPagoEditar ,
      detallePagoEditar:this.detallePagoEditar
    });
    if(this.metodoPagoEditar && this.detallePagoEditar){
      this._AbonoService
      .updateAbono(this.editarAbonoId, {
        metodoPagoEditar: this.metodoPagoEditar,
        detallePagoEditar: this.detallePagoEditar,
      })
      .subscribe(
        (data) => {
          Swal.fire({
            text: "Abono modificado con exito",
            icon: 'success',
          }).then((result) => {
            window.location.reload()
          })

        },
        (error) => {
          this.isLoad = false;
        }
      );
    }else{
      Swal.fire({
        text: "Complete todos los campos",
        icon: 'warning',
      })
    }
 
  }

  ngOnDestroy() {
    this.Subscription.unsubscribe();
  }
}
