import { Component } from "@angular/core";
import { TIPOS_GASTOS } from "@app/shared/components/forms/gasto-form/gasto-form.component";
import { Gasto } from "@app/shared/models/Gasto.model";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "app/auth/login/service/auth.service";
import { InversionResponse } from "app/shared/models/Inversion.model";
import {
  FiltrosList,
  Link,
  ListadoModel,
} from "app/shared/models/Listados.model";
import { FinanzasService } from "app/shared/services/finanzas.service";
import { HelpersService } from "app/shared/services/helpers.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-gastos-list",
  templateUrl: "./gastos-list.component.html",
  styleUrls: ["./gastos-list.component.scss"],
})
export class GastosListComponent {
  
  selectValuesPago: string[] = ["Efectivo", "Transferencia", "Otro"];
  Id: number;
  dateIni: string;
  dateFin: string;
  total_monto: number;
  tipoGasto: number = 99;
  metodoPago: number = 99;
  allDates: boolean = false;
  listadoFilter: FiltrosList = {
    link: null,
    estado: 1,
    filter:""
    // disablePaginate: "true",
  };
  selectValues: string[] = TIPOS_GASTOS;

  listadoData: ListadoModel<any>;
  Gastos: Gasto[];
  Gasto: Gasto;

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
    this.listadoFilter = {
      ...this.listadoFilter,
      dateIni: this.dateIni,
      dateFin: this.dateFin,
      allDates: this.allDates,
      tipoGasto: this.tipoGasto,
      metodoPago: this.metodoPago,
    };

    this._FinanzasService.getGastos(this.listadoFilter).subscribe(
      ({ response: Paginacion, total_monto }: any) => {
        this.listadoData = Paginacion;
        console.log(this.listadoData);
        this.Gastos = [...Paginacion.data];
        this.isLoad = false;
        this.total_monto = total_monto;
      },
      (error) => {
        this.isLoad = false;
      }
    );
    this.NgbModal.dismissAll();
  }

  openFiltros(content: any, gasto: Gasto = null) {
    // console.log(gasto);
    if (gasto) this.Gasto = gasto;
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
        this._FinanzasService.deleteGasto(data.id).subscribe((data) => {
          this.asignarValores();
          Swal.fire({
            text: data.mensaje,
            icon: "success",
          });
        });
      }
    });
  }

  limpiarFiltros() {
    this.setCurrentDate();
    this.allDates = false;
    this.tipoGasto = 99;
    this.asignarValores();
    this.NgbModal.dismissAll();
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

    this._FinanzasService.insertGasto(gasto).subscribe((data) => {
      console.log("[response]", data);
      this.Gastos = [{ ...gasto, id: data.id }, ...this.Gastos];
      Swal.fire({
        text: "El gasto se agregó con éxito",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          this.NgbModal.dismissAll();
          // location.reload();
        }
      });
    });
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

    this._FinanzasService.editarGasto(gasto, gasto.id).subscribe((data) => {
      console.log("[response]", data);
      this.Gastos = this.Gastos.map((pv) => {
        if (pv.id == gasto.id) {
          return {
            ...gasto,
          };
        }
        return pv;
      });
      // this.Productos_Vendidos.filter((pv)=>pv.id !== costosVenta.producto_id)
      Swal.fire({
        text: "El gasto se modificó con éxito",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          this.NgbModal.dismissAll();
          // location.reload();
        }
      });
    });
  }
}
