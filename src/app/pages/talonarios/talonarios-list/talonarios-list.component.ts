import { Component, ViewChild, ElementRef } from '@angular/core';
import { Gasto } from "@app/shared/models/Gasto.model";
import { Talonario } from "@app/shared/models/Talonario.model";
import { Usuario } from "@app/shared/models/Usuario.model";
import { TalonariosService } from "@app/shared/services/talonarios.service";
import { UsuariosService } from "@app/shared/services/usuarios.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "app/auth/login/service/auth.service";
import {
  FiltrosList,
  Link,
  ListadoModel,
} from "app/shared/models/Listados.model";
import { HelpersService } from "app/shared/services/helpers.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-talonarios-list",
  templateUrl: "./talonarios-list.component.html",
  styleUrls: ["./talonarios-list.component.scss"],
})
export class TalonariosListComponent {
  Id: number;
  dateIni: string;
  dateFin: string;
  allDates: boolean = false;
  listadoFilter: FiltrosList = {
    link: null,
    estado: 1,
    // disablePaginate: "true",
  };

  listadoData: ListadoModel<Talonario>;
  Talonarios: Talonario[];
  Talonario: Talonario;

  isLoad: boolean;
  userStore: Usuario[];
  @ViewChild('mySelect') mySelect!: ElementRef<HTMLSelectElement>;

  constructor(
    public _TalonariosService: TalonariosService,
    public _AuthService: AuthService,
    private NgbModal: NgbModal,
    private _HelpersService: HelpersService,
    private _UsuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.setCurrentDate();
    this.asignarValores();
  }

  asignarValores() {
    this.isLoad = true;
    this.listadoFilter = {
      ...this.listadoFilter,
      dateIni: this.dateIni,
      dateFin: this.dateFin,
      allDates: this.allDates,
    };

    this._TalonariosService.getTalonarios(this.listadoFilter).subscribe(
      (paginacion: ListadoModel<Talonario>) => {
        this.listadoData = paginacion;
        console.log(this.listadoData);
        this.Talonarios = [...paginacion.data];
        this.isLoad = false;
      },
      (error) => {
        this.isLoad = false;
      }
    );
    this.NgbModal.dismissAll();
  }

  openFiltros(content: any, gasto: Talonario = null) {
    // console.log(gasto);
    if (gasto) this.Talonario = gasto;
    // console.log(this.Gasto);

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

  eliminar(data: Gasto) {
    // console.log(data);
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Este gasto se eliminará y no podrás recuperarlo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#51cbce",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Eliminando el gasto",
          text: "Esto puede demorar un momento.",
          timerProgressBar: true,
          allowEscapeKey: false,
          allowOutsideClick: false,
          allowEnterKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        // this._TalonariosService.deleteGasto(data.id).subscribe((data) => {
        //   this.asignarValores();
        //   Swal.fire({
        //     text: data.mensaje,
        //     icon: "success",
        //   });
        // });
      }
    });
  }

  limpiarFiltros() {
    this.setCurrentDate();
    this.allDates = false;

    this.asignarValores();
    this.NgbModal.dismissAll();
  }

  getUsers() {
    this._UsuariosService.getUsuario().subscribe((usuarios: Usuario[]) => {
      this.userStore = usuarios;
    });
  }

  newPage(link: Link) {
    if (link.url == null) return;
    // console.log(link);

    this.listadoFilter.link = link.url;

    this.asignarValores();
  }

  FormsValuesDevolucion(gasto: Gasto) {
    console.log("[DevolucionFacturaForm]", gasto);

    Swal.fire({
      title: "Cargando el gasto",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // this._TalonariosService.insertGasto(gasto).subscribe((data) => {
    //   console.log("[response]", data);
    //   // this.Gastos = [{ ...gasto, id: data.id }, ...this.Gastos];
    //   Swal.fire({
    //     text: "El gasto se agregó con éxito",
    //     icon: "success",
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       this.NgbModal.dismissAll();
    //       // location.reload();
    //     }
    //   });
    // });
    // this.Productos_Vendidos.filter((pv)=>pv.id !== costosVenta.producto_id)

    // });
  }

  FormsValuesDevolucionEditar(gasto: Gasto) {
    console.log("[DevolucionFacturaForm]", gasto);

    Swal.fire({
      title: "Editando el gasto",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // this._FinanzasService.editarGasto(gasto, gasto.id).subscribe((data) => {
    //   console.log("[response]", data);
    //   // this.Gastos = this.Gastos.map((pv) => {
    //   //   if (pv.id == gasto.id) {
    //   //     return {
    //   //       ...gasto,
    //   //     };
    //   //   }
    //   //   return pv;
    //   // });
    //   // this.Productos_Vendidos.filter((pv)=>pv.id !== costosVenta.producto_id)
    //   Swal.fire({
    //     text: "El gato se modificó con éxito",
    //     icon: "success",
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       this.NgbModal.dismissAll();
    //       // location.reload();
    //     }
    //   });
    // });
  }
  asignarTalonario({ value }: HTMLSelectElement, talonario: Talonario) {
    console.log(value);
    let usuario = this.userStore.find((user) => user.id == Number(value));
    Swal.fire({
      html: `
      <h5 class="swal2-title px-0 font-weight-bolder" id="swal2-title" style="display: block;">
        ¿Desea asignar el talonario?
      </h5>

      <div class="swal2-html-container mx-0" id="swal2-html-container"  style="font-size:1em">
        <p>A <b>${usuario.name} ${usuario.apellido}</b> se le asignara el talonario <b>(${talonario.min}-${talonario.max})</b>.</p>
        </br>
        </div>
        `,
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#34b5b8",
      showCancelButton: true,
      cancelButtonColor: "#dc3545",
      cancelButtonText: "Cancelar",
      icon: "warning",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Editando el talonario",
          text: "Esto puede demorar un momento.",
          timerProgressBar: true,
          allowEscapeKey: false,
          allowOutsideClick: false,
          allowEnterKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        talonario.user_id = usuario.id;
        this._TalonariosService.updateTalonario(talonario).subscribe((data) => {
          console.log(data);
          Swal.fire({
            text: data.mensaje,
            icon: "success",
          });
        });
      }else{
        const selectElement = document.getElementById('select-talonario-'+talonario.id) as HTMLSelectElement;
        console.log(selectElement);
        
        if (selectElement) {
          selectElement.value = String(talonario.user_id);
        }
        // value = String(talonario.user_id)
      }
    });
    // <p class="font-italic font-weight-bolder" style="font-size:0.725em">Esta acción no es modificable.</p>
  }
}
