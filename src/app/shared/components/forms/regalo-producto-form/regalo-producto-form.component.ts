import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {
  NgbModalOptions,
  NgbModal,
  NgbModalConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { environment } from "../../../../../environments/environment.prod";
import { Producto } from "../../../models/Producto.model";
import { ProductosService } from "../../../services/productos.service";
import { FacturasService } from "../../../services/facturas.service";
import { TablasService } from "../../../services/tablas.service";
import { CheckoutService } from "../../../services/checkout.service";
import { FacturaDetalle } from "../../../models/FacturaDetalle.model";
import { map } from "rxjs/operators";
import { FacturaCheckout } from "../../../models/FacturaCheckout.model";
import { RegaloService } from '../../../services/regalo.service';
import { CommunicationService } from '../../../services/communication.service';

@Component({
  selector: "app-regalo-producto-form",
  templateUrl: "./regalo-producto-form.component.html",
  styleUrls: ["./regalo-producto-form.component.css"],
  providers: [NgbModalConfig, NgbModal],
})
export class RegaloProductoFormComponent implements OnInit {
  @ViewChild("modalProducto") modalP: ElementRef<any>;
  @Input() id:number

  modalOptions: NgbModalOptions;

  page = 1;
  pageSize = environment.PageSize;
  collectionSize = 0;

  isLoad: boolean;
  Productos: Producto[];

  Producto: Producto;
  // Clientes:Cliente[]
  // Usuarios:Usuario[]
  ClienteId: number = 0;
  UsuarioId: number = 0;

  constructor(
    private modalService: NgbModal,
    private _ProductosService: ProductosService,
    public _FacturasService: FacturasService,
    public _TablasService: TablasService,
    public _CheckoutService: CheckoutService,
    public _RegaloService: RegaloService,
    public _CommunicationService: CommunicationService,
    config: NgbModalConfig,

  ) {
    // customize default values of modals used by this component tree
    config.backdrop = "static";
    config.keyboard = false;
  }

  ngOnInit(): void {
    // this._ClientesService.getCliente().subscribe((clientes:Cliente[])=> this.Clientes = [...clientes])
    // this._UsuariosService.getUsuario().subscribe((usuarios:Usuario[])=> this.Usuarios = [...usuarios])

    this.loadProduct();
  }

  loadProduct(): void {
    this.isLoad = true;
    let productosStorage: FacturaDetalle[] =
      this._CheckoutService.getProductCheckout();

    this._ProductosService
      .getProducto()
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
    // this._ProductosService.producto = producto
    this.Producto = producto;

    this.modalService
      .open(this.modalP, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        () => {},
        (reason) => {
          // console.log(reason);
        }
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

  FormsValues(regalo: Producto) {
    console.log(regalo);
    this._RegaloService.setRegalo(regalo,this.id).subscribe(data=>{
      console.log(data);
      this._CommunicationService.RefreshList.emit(true)
    })

    this.modalService.dismissAll();
  }

  open(content,size:string="md") {
    this.modalService.open(content,{size});
  }
}
