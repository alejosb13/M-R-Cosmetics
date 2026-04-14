import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { CommunicationService } from "@app/shared/services/communication.service";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { FacturaCheckout } from "app/shared/models/FacturaCheckout.model";
import { FacturaDetalle } from "app/shared/models/FacturaDetalle.model";
import { Producto } from "app/shared/models/Producto.model";
import { CheckoutService } from "app/shared/services/checkout.service";
import { FacturasService } from "app/shared/services/facturas.service";
import { ProductosService } from "app/shared/services/productos.service";
import { TablasService } from "app/shared/services/tablas.service";
import { environment } from "environments/environment";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "@app/auth/login/service/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-factura-insertar",
  templateUrl: "./factura-insertar.component.html",
  styleUrls: ["./factura-insertar.component.css"],
})
export class FacturaInsertarComponent implements OnInit {
  @ViewChild("modalProducto") modalP: ElementRef<any>;
  modalOptions: NgbModalOptions;

  page = 1;
  pageSize = environment.PageSize;
  collectionSize = 0;

  isLoad: boolean;
  Productos: Producto[];

  Producto: Producto;
  ClienteId: number = 0;
  UsuarioId: number = 0;
  Stock: number = 1;

  // Kshea: modo precio contado
  isKshea: boolean = false;
  precioContado: boolean = false; // false = crédito, true = contado

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    private modalService: NgbModal,
    private _ProductosService: ProductosService,
    public _FacturasService: FacturasService,
    public _TablasService: TablasService,
    public _CheckoutService: CheckoutService,
    private _AuthService: AuthService,
  ) {}

  ngOnInit(): void {
    this.isKshea = this._AuthService.isKshea();

    this.loadProduct();

    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        console.log(color);

        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
  }

  cambiarFiltroStock(event: any): void {
    this.Stock = event ? 1 : 0;
    this.loadProduct();
  }

  cambiarFiltroPrecioContado(event: any): void {
    this.precioContado = !!event;
  }

  loadProduct(): void {
    this.isLoad = true;
    let productosStorage: FacturaDetalle[] =
      this._CheckoutService.getProductCheckout();

    this._ProductosService
      .getProducto({ stock: this.Stock })
      .pipe(
        map((productos: Producto[]) =>
          productos.map((producto) => {
            let productoS: FacturaDetalle = productosStorage.find(
              (productoStorage) => productoStorage.producto_id === producto.id
            );
            if (productoS) producto.stock = producto.stock - productoS.cantidad;
            return producto;
          })
        )
      )

      .subscribe(
        (producto: Producto[]) => {
          this.Productos = [...producto];
          this._TablasService.datosTablaStorage = [...producto];
          this._TablasService.total = producto.length;
          this._TablasService.busqueda = "";
          this.refreshCountries();

          this.isLoad = false;
        },
        (error) => {
          this.isLoad = false;
        }
      );
  }

  // agregarProducto(event:any,producto:Producto){
  //   console.log(event);
  //   console.log(producto);

  // }

  openFormProduct(producto: Producto) {
    // Validación Kshea: el carrito solo puede mezclar un tipo de precio
    if (this.isKshea) {
      const tipoPrecioActual = this._CheckoutService.getTipoPrecio();
      const tipoNuevo: 'contado' | 'credito' = this.precioContado ? 'contado' : 'credito';
      const productosEnCarrito = this._CheckoutService.getProductCheckout();

      if (tipoPrecioActual && tipoPrecioActual !== tipoNuevo && productosEnCarrito.length > 0) {
        Swal.mixin({ customClass: { container: this.themeSite } }).fire({
          title: 'Tipo de precio diferente',
          html: `El carrito ya tiene productos de <b>${tipoPrecioActual}</b>.<br>
                 No puedes mezclar productos de <b>contado</b> y <b>crédito</b>.<br>
                 Vacía el carrito para cambiar el tipo.`,
          icon: 'warning',
        });
        return;
      }

      // Si el producto contado no tiene precio_contado configurado, no permite agregarlo en modo contado
      if (tipoNuevo === 'contado' && (producto.precio_contado == null)) {
        Swal.mixin({ customClass: { container: this.themeSite } }).fire({
          text: 'Este producto no tiene precio contado configurado.',
          icon: 'warning',
        });
        return;
      }
    }

    this.Producto = { ...producto };

    // Si Kshea + contado, reemplazamos el precio por precio_contado para el modal
    if (this.isKshea && this.precioContado && producto.precio_contado != null) {
      this.Producto = { ...producto, precio: producto.precio_contado };
    }

    this.modalService
      .open(this.modalP, {
        ariaLabelledBy: "modal-basic-title",
        windowClass:
          this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
      })
      .result.then(
        () => {},
        (reason) => {}
      );
  }

  CambiarSelect(select: HTMLSelectElement) {
    let value = select.value;
    let name = select.name;
    let optionsToArray: [] = Array.from(select.options) as [];
    let optionSeleccionado: HTMLOptionElement =
      optionsToArray[select.selectedIndex];

    let FacturaCheckout: FacturaCheckout = this._CheckoutService.getCheckout();

    if (name == "usuario") {
      FacturaCheckout.user_id = Number(value);
      FacturaCheckout.userFullName = optionSeleccionado.text;
    }

    if (name == "cliente") {
      FacturaCheckout.cliente_id = Number(value);
      FacturaCheckout.clienteFullName = optionSeleccionado.text;
    }

    this._CheckoutService.CheckoutToStorage(FacturaCheckout);
  }

  actualizarProducto(product: Producto) {
    this.Productos = this.Productos.map((producto) => {
      if (producto.id == product.id) {
        producto.stock = producto.stock - product.stock;
      }

      return producto;
    });
  }

  refreshCountries() {
    this._TablasService.datosTablaStorage = [...this.Productos].slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
  }

  BuscarValor() {
    // console.log("si");

    let camposPorFiltrar: any[] = [["descripcion"]];
    this._TablasService.buscarEnCampos(this.Productos, camposPorFiltrar);

    if (this._TablasService.busqueda == "") {
      this.refreshCountries();
    }
  }

  FormsValues(producto: Producto) {
    console.log(producto);

    this._CheckoutService.addProductCheckout(producto);
    this.actualizarProducto(producto);

    // Kshea: guardar el tipo de precio en el checkout
    if (this.isKshea) {
      const factura: FacturaCheckout = this._CheckoutService.getCheckout();
      factura.tipo_precio = this.precioContado ? 'contado' : 'credito';
      this._CheckoutService.CheckoutToStorage(factura);
    }

    let numeroProductos: FacturaDetalle[] =
      this._CheckoutService.getProductCheckout();
    this._CheckoutService.numeroProductos.next(numeroProductos.length);

    this.modalService.dismissAll();
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
