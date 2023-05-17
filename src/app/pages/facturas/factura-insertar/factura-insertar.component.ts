import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FacturaCheckout } from 'app/shared/models/FacturaCheckout.model';
import { FacturaDetalle } from 'app/shared/models/FacturaDetalle.model';
import { Producto } from 'app/shared/models/Producto.model';
import { CheckoutService } from 'app/shared/services/checkout.service';
import { FacturasService } from 'app/shared/services/facturas.service';
import { ProductosService } from 'app/shared/services/productos.service';
import { TablasService } from 'app/shared/services/tablas.service';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-factura-insertar',
  templateUrl: './factura-insertar.component.html',
  styleUrls: ['./factura-insertar.component.css']
})
export class FacturaInsertarComponent implements OnInit {

  @ViewChild('modalProducto') modalP: ElementRef<any>;
  modalOptions:NgbModalOptions;

  page = 1;
  pageSize = environment.PageSize;
  collectionSize = 0;

  isLoad:boolean
  Productos:Producto[]

  Producto:Producto
  // Clientes:Cliente[]
  // Usuarios:Usuario[]
  ClienteId:number=0
  UsuarioId:number=0

  constructor(
    private modalService: NgbModal,
    private _ProductosService: ProductosService,
    public _FacturasService: FacturasService,
    // private _ClientesService: ClientesService,
    // private _UsuariosService: UsuariosService,
    public _TablasService:TablasService,
    public _CheckoutService:CheckoutService

  ) { }

  ngOnInit(): void {
    // this._ClientesService.getCliente().subscribe((clientes:Cliente[])=> this.Clientes = [...clientes])
    // this._UsuariosService.getUsuario().subscribe((usuarios:Usuario[])=> this.Usuarios = [...usuarios])

    this.loadProduct()
  }

  loadProduct(): void {
    this.isLoad = true
    let productosStorage: FacturaDetalle[] = this._CheckoutService.getProductCheckout()

    this._ProductosService.getProducto()
    .pipe(
      map((productos : Producto[]) => productos.map(producto =>{
        let productoS:FacturaDetalle = productosStorage.find(productoStorage => productoStorage.producto_id === producto.id )
        if(productoS) producto.stock = producto.stock - productoS.cantidad
        return producto
      }))
    )

    .subscribe((producto:Producto[])=> {
      this.Productos= [...producto]
      this._TablasService.datosTablaStorage = [...producto]
      this._TablasService.total = producto.length
      this._TablasService.busqueda = ""
      this.refreshCountries()

      this.isLoad =false
    },(error)=>{
      this.isLoad =false
    })
  }

  // agregarProducto(event:any,producto:Producto){
  //   console.log(event);
  //   console.log(producto);

  // }

  openFormProduct(producto:Producto){
    // this._ProductosService.producto = producto
    this.Producto = producto

    this.modalService.open(this.modalP, {ariaLabelledBy: 'modal-basic-title'}).result
      .then(
        () => {},
        reason => {
          // console.log(reason);
        }
      );

  }

  CambiarSelect(select:HTMLSelectElement){
    let value = select.value
    let name = select.name
    let optionsToArray:[] = Array.from(select.options) as []
    let optionSeleccionado:HTMLOptionElement = optionsToArray[select.selectedIndex]

    let FacturaCheckout: FacturaCheckout = this._CheckoutService.getCheckout()

    if(name == "usuario" ) {
      FacturaCheckout.user_id =  Number(value)
      FacturaCheckout.userFullName = optionSeleccionado.text
    }

    if(name == "cliente" ){
      FacturaCheckout.cliente_id =  Number(value)
      FacturaCheckout.clienteFullName =  optionSeleccionado.text
    }

    this._CheckoutService.CheckoutToStorage(FacturaCheckout)
  }

  actualizarProducto(product:Producto){
    this.Productos = this.Productos.map(producto => {
      if(producto.id == product.id){
        producto.stock = producto.stock - product.stock
      }

      return producto
    })
  }

  refreshCountries() {
    this._TablasService.datosTablaStorage = [...this.Productos]
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  BuscarValor(){
    // console.log("si");

    let camposPorFiltrar:any[] = [
      ['descripcion'],
    ];
    this._TablasService.buscarEnCampos(this.Productos,camposPorFiltrar)

    if(this._TablasService.busqueda ==""){this.refreshCountries()}

  }

  FormsValues(producto:Producto){
    console.log(producto);

    this._CheckoutService.addProductCheckout(producto)
    this.actualizarProducto(producto)

    let numeroProductos:FacturaDetalle[] = this._CheckoutService.getProductCheckout()
    this._CheckoutService.numeroProductos.next(numeroProductos.length)

    this.modalService.dismissAll()
  }

}
