import { Component } from "@angular/core";
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
import { CostoVenta } from "../../../../shared/models/CostosVentas.model";

@Component({
  selector: "app-costos-list",
  templateUrl: "./costos-list.component.html",
  styleUrls: ["./costos-list.component.scss"],
})
export class CostosListComponent {
  Id: number;
  costoTotal: number;
  cantidadTotal: number;
  producto_id: number;
  dateIni: string;
  dateFin: string;
  allDates: boolean = false;
  listadoFilter: FiltrosList = {
    link: null,
    estado: 1,
    // disablePaginate: "true",
  };

  listadoData: ListadoModel<any>;
  Productos_Vendidos: any[];

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
    };

    this._FinanzasService.getProductosVendidos(this.listadoFilter).subscribe(
      (Paginacion: any) => {
        this.listadoData = Paginacion;
        console.log(this.listadoData);
        this.Productos_Vendidos = [...Paginacion.productos.data];
        this.costoTotal = Paginacion.costoTotal;
        this.cantidadTotal = Paginacion.totalProductos;
        this.isLoad = false;
      },
      (error) => {
        this.isLoad = false;
      }
    );
    this.NgbModal.dismissAll();
  }

  openFiltros(
    content: any,
    producto_id: number = undefined,
    id: number = undefined
  ) {
    console.log(producto_id);
    if (producto_id) this.producto_id = producto_id;
    if (id) this.Id = id;

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

  eliminar(data: InversionResponse) {
    // console.log(data);
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta inversión se eliminará y no podrás recuperarla.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#51cbce",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this._FinanzasService.deleteInversion(data.id).subscribe((data) => {
          // this.Frecuencias = this.Frecuencias.filter(categoria => categoria.id != id)
          this.asignarValores();
          Swal.fire({
            text: data[0],
            icon: "success",
          });
        });
      }
    });
  }

  bloquear(data: InversionResponse) {
    // console.log(data);
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Una vez cerrada solo podras visualizar los datos.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#51cbce",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this._FinanzasService
          .changeValueInversion(data.id, {
            estatus_cierre: 1,
          })
          .subscribe((data) => {
            // this.Frecuencias = this.Frecuencias.filter(categoria => categoria.id != id)
            this.asignarValores();
            Swal.fire({
              text: data[0],
              icon: "success",
            });
          });
      }
    });
  }

  limpiarFiltros() {
    this.setCurrentDate();
    this.allDates = false;

    this.asignarValores();
    this.NgbModal.dismissAll();
  }

  newPage(link: Link) {
    if (link.url == null) return;
    // console.log(link);

    this.listadoFilter.link = link.url;

    this.asignarValores();
  }

  FormsValuesDevolucion(costosVenta: CostoVenta) {
    console.log("[DevolucionFacturaForm]", costosVenta);

    Swal.fire({
      title: "Cargando el costo",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this._FinanzasService.insertCostoVenta(costosVenta).subscribe((data) => {
      console.log("[response]", data);
      this.Productos_Vendidos = this.Productos_Vendidos.map((pv) => {
        if (pv.id == costosVenta.producto_id) {
          return {
            ...pv,
            costo_opcional: { costo: costosVenta.costo, id: data.id },
          };
        }
        return pv;
      });
      // this.Productos_Vendidos.filter((pv)=>pv.id !== costosVenta.producto_id)
      this.costoTotal = Number(this.costoTotal) + Number(costosVenta.costo);
      Swal.fire({
        text: "El costo se agregó con éxito",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          this.NgbModal.dismissAll();
          // location.reload();
        }
      });
    });
  }

  FormsValuesDevolucionEditar(costosVenta: CostoVenta) {
    console.log("[DevolucionFacturaForm]", costosVenta);

    Swal.fire({
      title: "Editando el costo",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this._FinanzasService
      .editarCostoVenta(costosVenta, this.Id)
      .subscribe((data) => {
        console.log("[response]", data);
        this.Productos_Vendidos = this.Productos_Vendidos.map((pv) => {
          if (pv.id == costosVenta.producto_id) {
            return {
              ...pv,
              costo_opcional: {
                ...pv.costo_opcional,
                costo: costosVenta.costo,
              },
            };
          }
          return pv;
        });
        // this.Productos_Vendidos.filter((pv)=>pv.id !== costosVenta.producto_id)
        Swal.fire({
          text: "El costo se modificó con éxito",
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
