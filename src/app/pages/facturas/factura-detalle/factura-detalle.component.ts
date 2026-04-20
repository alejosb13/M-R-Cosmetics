import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommunicationService } from "@app/shared/services/communication.service";
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "app/auth/login/service/auth.service";
import { DevolucionProductoService } from "app/pages/devoluciones/services/devolucion-producto.service";
import { DevolucionFacturaService } from "app/pages/devoluciones/services/devolucion-factura.service";
import { DevolucionProducto } from "app/shared/models/DevolucionProducto.model";
import { Factura } from "app/shared/models/Factura.model";
import { FacturaDetalle } from "app/shared/models/FacturaDetalle.model";
import { Producto } from "app/shared/models/Producto.model";
import { RegaloFacturado } from "app/shared/models/Regalo";
import { ClientesService } from "app/shared/services/clientes.service";
import { FacturaDetalleService } from "app/shared/services/facturaDetalle.service";
import { FacturasService } from "app/shared/services/facturas.service";
import { HelpersService } from "app/shared/services/helpers.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { ConfiguracionService } from "../../../shared/services/configuracion.service";
import { RegaloService } from "../../../shared/services/regalo.service";

type ProductoDetalle = Producto & FacturaDetalle;

@Component({
  selector: "app-factura-detalle",
  templateUrl: "./factura-detalle.component.html",
  styleUrls: ["./factura-detalle.component.css"],
  providers: [NgbModalConfig, NgbModal],
})
export class FacturaDetalleComponent implements OnInit {
  isLoad: boolean = false;
  FacturaId: number;
  Factura: Factura;

  Pagado: number = 0;
  Diferencia: number = 0;

  closeResult = "";
  expandedIndex: number = -1;

  ProductoDetalle: Producto;
  isBonificacion: boolean = false;

  isAdmin: boolean;
  isKshea: boolean = false;

  tazaMonto: number = 0;
  isLoadtazaMonto: boolean = false;
  existTaza: boolean = false;

  Regalos: RegaloFacturado[] = [];

  isBonificacionExpanded: boolean = false;

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    private _FacturasService: FacturasService,
    private _ActivatedRoute: ActivatedRoute,
    private _HelpersService: HelpersService,
    private _FacturaDetalleService: FacturaDetalleService,
    private _ClientesService: ClientesService,
    private _DevolucionProductoService: DevolucionProductoService,
    private _DevolucionFacturaService: DevolucionFacturaService,
    private _AuthService: AuthService,
    private NgbModal: NgbModal,
    private _ConfiguracionService: ConfiguracionService,
    private _RegaloService: RegaloService,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this._AuthService.isAdmin();
    this.isKshea = this._AuthService.isKshea();
    this.FacturaId = Number(this._ActivatedRoute.snapshot.params.id);
    this.facturaById(this.FacturaId);
    this.getTazaFactura();

    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        console.log(color);

        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
  }

  Validar_si_se_le_debe_al_cliente(cliente_id: number) {
    this._ClientesService.getDeudaCliente(cliente_id).subscribe((data) => {
      console.log("[Validar_si_se_le_debe_al_cliente]", data);
      if (data.deuda_vendedor) {
        Swal.mixin({
          customClass: {
            container: this.themeSite, // Clase para el modo oscuro
          },
        }).fire({
          text: `Se le debe a este cliente un total de $${data.deuda}`,
          icon: "warning",
        });
      }
    });
  }

  ValidarRegalos(ids: number[]) {
    ids.map((id) => {
      // console.log("[ValidarRegalos]",ids);
      this._RegaloService.getRegalosXdetalleFactura(id).subscribe((data) => {
        // console.log(facturaDetalles);
        if (data.regalo_facturado && data.regalo_facturado.length > 0) {
          this.Regalos = [...this.Regalos, ...data.regalo_facturado];
        }

        console.log("[ValidarRegalos response]", data);
      });
    });
  }

  facturaById(FacturaId: number) {
    this.isLoad = true;
    this._FacturasService
      .getFacturaById(FacturaId)
      // .pipe(
      //   map((factura : Factura) => {
      //     factura.factura_historial = factura.factura_historial.filter( abono => abono.estado == 1)
      //     return factura
      //   })
      // )
      .subscribe(
        (factura: Factura) => {
          console.log(factura);

          this.Factura = factura;

          let idsDetalles: number[] = this.Factura.factura_detalle.map(
            (detalle) => detalle.id,
          );
          // console.log(idsDetalles);

          this.ValidarRegalos(idsDetalles);
          this.Validar_si_se_le_debe_al_cliente(factura.cliente_id);
          this.validarBonificacion(factura);
          // if(factura.factura_historial.length > 0 && factura.tipo_venta == 1){
          //   let abonos:any =  factura.factura_historial.map(itemHistorial =>{ if(itemHistorial.estado == 1) return itemHistorial.precio   })
          //   let abonosStatusActive = abonos.filter((abono:any) => abono != undefined );

          //   this.Pagado = abonosStatusActive.reduce((valorAnterior:number, valor:number) => valorAnterior + valor)
          //   this.Diferencia =  factura.monto - this.Pagado
          // }else{
          //   this.Diferencia =  factura.monto
          // }

          this.isLoad = false;
        },
        () => (this.isLoad = false),
      );
  }

  validarBonificacion(factura: Factura) {
    if (
      factura.factura_bonificacion &&
      factura.factura_bonificacion.length > 0
    ) {
      const totalProductosBonificados = factura.factura_bonificacion.reduce(
        (total, bonificacion) => total + bonificacion.precio,
        0,
      );

      const bonificacionTotal = factura.bonificacionTotal || 0;

      if (totalProductosBonificados > bonificacionTotal) {
        Swal.mixin({
          customClass: {
            container: this.themeSite,
          },
        }).fire({
          title: "Advertencia de Bonificación",
          html: `El precio total de los productos bonificados (<b>$${totalProductosBonificados.toFixed(2)}</b>) es mayor al monto de bonificación disponible (<b>$${bonificacionTotal.toFixed(2)}</b>).<br><br>La factura no califica para bonificación o la bonificación es insuficiente.`,
          icon: "warning",
        });
      }
    }
  }

  descargarPDF() {
    // let data = {
    //   factura: this.Factura,
    //   abonado:this.Pagado,
    //   diferencia:this.Diferencia
    // }
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    }).fire({
      title: "Descargando archivo.",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this._FacturasService.FacturaPDF(this.FacturaId).subscribe((data) => {
      console.log(data);
      Swal.mixin({
        customClass: {
          container: this.themeSite, // Clase para el modo oscuro
        },
      }).fire({
        text: "Archivo descargado con éxito.",
        icon: "success",
      });
      this._HelpersService.downloadFile(
        data,
        `Detalle_Factura_${this.FacturaId}`,
      );
    });
  }

  descargarPDFDolar() {
    // let data = {
    //   factura: this.Factura,
    //   abonado:this.Pagado,
    //   diferencia:this.Diferencia
    // }
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    }).fire({
      title: "Descargando archivo.",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this._FacturasService.FacturaPDFDolar(this.FacturaId).subscribe((data) => {
      console.log(data);
      Swal.mixin({
        customClass: {
          container: this.themeSite, // Clase para el modo oscuro
        },
      }).fire({
        text: "Archivo descargado con éxito.",
        icon: "success",
      });
      this._HelpersService.downloadFile(
        data,
        `Detalle_Factura_${this.FacturaId}`,
      );
    });
  }

  actualizarTaza() {
    this._ConfiguracionService
      .updateTazaFactura(Number(this.tazaMonto), this.FacturaId)
      .subscribe(({ data }) => {
        this.getTazaFactura();
        // this.NgbModal.dismissAll()
      });
  }

  agregarTaza() {
    this._ConfiguracionService
      .setTazaFactura(Number(this.tazaMonto), this.FacturaId)
      .subscribe(({ data }) => {
        this.getTazaFactura();
      });
  }

  open(content: any) {
    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
    }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  openEditFactura(content: any, producto: Producto) {
    this.ProductoDetalle = producto;
    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
    }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  openDevolverProducto(content: any, producto: Producto, isBonificacion: boolean = false) {
    this.ProductoDetalle = producto;
    this.isBonificacion = isBonificacion;
    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
    })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      )
      .catch((err) => {});
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  Collaps(index: number) {
    this.expandedIndex = index === this.expandedIndex ? -1 : index;
  }

  FormsValues(productoDetalle: FacturaDetalle) {
    console.log(productoDetalle);

    this._FacturaDetalleService
      .updateFacturaDetalle(Number(productoDetalle?.id), productoDetalle)
      .subscribe((data) => {
        // console.log(data);

        this.facturaById(this.FacturaId);

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

  FormsValuesDevolucion(DevolucionProducto: DevolucionProducto) {
    console.log("[DevolucionProductoForm]", DevolucionProducto);

    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    }).fire({
      title: "Cargando la devolución",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const devolucionObservable = this.isBonificacion
      ? this._DevolucionFacturaService.insertDevolucionBonificacion(DevolucionProducto)
      : this._DevolucionProductoService.insertDevolucion(DevolucionProducto);

    devolucionObservable
      .subscribe((data) => {
        console.log("[response]", data);

        Swal.mixin({
          customClass: {
            container: this.themeSite, // Clase para el modo oscuro
          },
        })
          .fire({
            text: "La devolución fue realizada con exito",
            icon: "success",
          })
          .then((result) => {
            if (result.isConfirmed) {
              location.reload();
              // this.NgbModal.dismissAll();
              // this.facturaById(this.FacturaId);
            }
          });
      });
  }

  despachar(id: number) {
    // console.log(id);
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    })
      .fire({
        title: "¿Estás seguro?",
        text: "Este factura será regresada a la seccion de facturas despachadas.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#51cbce",
        cancelButtonColor: "#d33",
        confirmButtonText: "Realizar",
        cancelButtonText: "Cancelar",
      })
      .then((result) => {
        if (result.isConfirmed) {
          this._FacturasService
            .despacharFactura(id, { despachado: 0 })
            .subscribe((data) => {
              this.facturaById(this.FacturaId);
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

  openModal(content: any) {
    this.NgbModal.open(content, {
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
    });
  }

  getTazaFactura() {
    this.isLoadtazaMonto = true;
    this.NgbModal.dismissAll();

    this._ConfiguracionService.getTazaFactura(this.FacturaId).subscribe(
      ({ data }) => {
        this.isLoadtazaMonto = false;
        console.log("factura taza", data);
        if (data) {
          this.existTaza = true;
          this.tazaMonto = data.monto;
        } else {
          this.existTaza = false;
        }
      },
      () => {
        this.isLoadtazaMonto = false;
      },
    );
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
