import { Component } from "@angular/core";
import { CommunicationService } from "@app/shared/services/communication.service";
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
import { Subscription } from "rxjs";
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
  Producto: any;
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

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    public _FinanzasService: FinanzasService,
    public _AuthService: AuthService,
    private NgbModal: NgbModal,
    private _HelpersService: HelpersService
  ) {}

  ngOnInit(): void {
    this.setCurrentDate();
    this.asignarValores();

    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
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
        this.listadoData = Paginacion.productos;
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
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
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
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    })
      .fire({
        title: "¿Estás seguro?",
        text: "Esta inversión se eliminará y no podrás recuperarla.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#51cbce",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      })
      .then((result) => {
        if (result.isConfirmed) {
          this._FinanzasService.deleteInversion(data.id).subscribe((data) => {
            // this.Frecuencias = this.Frecuencias.filter(categoria => categoria.id != id)
            this.asignarValores();
            Swal.mixin({
              customClass: {
                container: this.themeSite, // Clase para el modo oscuro
              },
            }).fire({
              text: data[0],
              icon: "success",
            });
          });
        }
      });
  }

  bloquear(data: InversionResponse) {
    // console.log(data);
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    })
      .fire({
        title: "¿Estás seguro?",
        text: "Una vez cerrada solo podras visualizar los datos.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#51cbce",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
      })
      .then((result) => {
        if (result.isConfirmed) {
          this._FinanzasService
            .changeValueInversion(data.id, {
              estatus_cierre: 1,
            })
            .subscribe((data) => {
              // this.Frecuencias = this.Frecuencias.filter(categoria => categoria.id != id)
              this.asignarValores();
              Swal.mixin({
                customClass: {
                  container: this.themeSite, // Clase para el modo oscuro
                },
              }).fire({
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

    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    })
      .mixin({
        customClass: {
          container: this.themeSite, // Clase para el modo oscuro
        },
      })
      .fire({
        title: "Cargando el costo",
        text: "Esto puede demorar un momento.",
        timerProgressBar: true,
        allowEscapeKey: false,
        allowOutsideClick: false,
        allowEnterKey: false,
        didOpen: () => {
          Swal.mixin({
            customClass: {
              container: this.themeSite, // Clase para el modo oscuro
            },
          }).showLoading();
        },
      });

    this._FinanzasService.insertCostoVenta({...costosVenta,dateIni:this.dateIni}).subscribe((data) => {
      console.log("[response]", data);
      this.Productos_Vendidos = this.Productos_Vendidos.map((pv) => {
        if (pv.id == costosVenta.producto_id) {
          this.costoTotal = Number(this.costoTotal) + Number(data.costo_ventas_detalles.costo * pv.cantidad);
          return {
            ...pv,
            costo_opcional: { costo: costosVenta.costo, id: data.id,costo_ventas_detalles: [data.costo_ventas_detalles] },
          };
        }
        return pv;
      });
      // this.Productos_Vendidos.filter((pv)=>pv.id !== costosVenta.producto_id)
      // this.Productos_Vendidos.find((data)=>data.)
      // this.costoTotal = Number(this.costoTotal) + Number(data.costo_ventas_detalles.costo);
      Swal.mixin({
        customClass: {
          container: this.themeSite, // Clase para el modo oscuro
        },
      })
        .fire({
          text: "El costo se agregó con éxito",
          icon: "success",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.NgbModal.dismissAll();
            // location.reload();
          }
        });
    });
  }

  FormsValuesDevolucionEditar(costosVenta: CostoVenta) {
    console.log("[DevolucionFacturaForm]", costosVenta);

    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    }).fire({
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
      .editarCostoVenta(
        { ...costosVenta, dateIni: this.dateIni, dateFin: this.dateFin },
        this.Id
      )
      .subscribe((data) => {
        console.log("[response]", data);
        this.Productos_Vendidos = this.Productos_Vendidos.map((pv) => {
          if (pv.id == costosVenta.producto_id) {
            // this.costoTotal = Number(this.costoTotal) + Number(costosVenta.costo * pv.cantidad);
            return {
              ...pv,
              costo_opcional: {
                ...pv.costo_opcional,
                costo: costosVenta.costo,
                costo_ventas_detalles: [{
                  ...pv.costo_opcional.costo_ventas_detalles,
                  costo: costosVenta.costo
                }]
              },
            };
          }
          return pv;
        });
        // this.Productos_Vendidos.filter((pv)=>pv.id !== costosVenta.producto_id)
        Swal.mixin({
          customClass: {
            container: this.themeSite, // Clase para el modo oscuro
          },
        })
          .fire({
            text: "El costo se modificó con éxito",
            icon: "success",
          })
          .then((result) => {
            if (result.isConfirmed) {
              this.NgbModal.dismissAll();
              // location.reload();
            }
          });
      });
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
