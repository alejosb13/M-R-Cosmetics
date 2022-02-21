import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Cliente } from 'app/shared/models/Cliente.model';
import { FacturaCheckout } from 'app/shared/models/FacturaCheckout.model';
import { FacturaDetalle } from 'app/shared/models/FacturaDetalle.model';
import { Producto } from 'app/shared/models/Producto.model';
import { Usuario } from 'app/shared/models/Usuario.model';
import { CheckoutService } from 'app/shared/services/checkout.service';
import { ClientesService } from 'app/shared/services/clientes.service';
import { FacturasService } from 'app/shared/services/facturas.service';
import { ProductosService } from 'app/shared/services/productos.service';
import { TablasService } from 'app/shared/services/tablas.service';
import { UsuariosService } from 'app/shared/services/usuarios.service';

@Component({
  selector: 'app-factura-insertar',
  templateUrl: './factura-insertar.component.html',
  styleUrls: ['./factura-insertar.component.css']
})
export class FacturaInsertarComponent implements OnInit {
  
  @ViewChild('modalProducto') modalP: ElementRef<any>;
  modalOptions:NgbModalOptions;
  
  page = 1;
  pageSize = 3;
  collectionSize = 0;
  
  isLoad:boolean
  Productos:Producto[]
  
  Producto:Producto
  Clientes:Cliente[]
  Usuarios:Usuario[]
  ClienteId:number=0
  UsuarioId:number=0
  
  constructor(
    private modalService: NgbModal,
    private _ProductosService: ProductosService,
    public _FacturasService: FacturasService,
    private _ClientesService: ClientesService,
    private _UsuariosService: UsuariosService,
    public _TablasService:TablasService,
    public _CheckoutService:CheckoutService
    
  ) { }

  ngOnInit(): void {
    this._ClientesService.getCliente().subscribe((clientes:Cliente[])=> this.Clientes = [...clientes])
    this._UsuariosService.getUsuario().subscribe((usuarios:Usuario[])=> this.Usuarios = [...usuarios])
    
    this.loadProduct()
  }
  
  loadProduct(): void {
    this.isLoad = true
    this._ProductosService.getProducto().subscribe((producto:Producto[])=> {
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
  
  agregarProducto(event:any,producto:Producto){
    console.log(event);
    console.log(producto);
    
  }
  
  openFormProduct(producto:Producto){
    // this._ProductosService.producto = producto 
    this.Producto = producto
    
    this.modalService.open(this.modalP, {ariaLabelledBy: 'modal-basic-title'}).result
      .then(
        () => {},
        reason => {
          console.log(reason);
        }
      );
    
  }
  
  CambiarSelect(select:HTMLSelectElement){
    let value = select.value
    let name = select.name
    let optionsToArray:[] = Array.from(select.options) as []
    let optionSeleccionado:HTMLOptionElement = optionsToArray[select.selectedIndex]
    
    let FacturaCheckout: FacturaCheckout = {...this._CheckoutService.dataStorage}

    if(name == "usuario" ) {
      FacturaCheckout.user_id =  Number(value)
      FacturaCheckout.userFullName = optionSeleccionado.text
    }
    
    if(name == "cliente" ){
      FacturaCheckout.cliente_id =  Number(value)
      FacturaCheckout.clienteFullName =  optionSeleccionado.text
    }
    
    this._CheckoutService.dataStorage = {...FacturaCheckout}
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
    this._TablasService.buscar(this.Productos)
    
    if(this._TablasService.busqueda ==""){this.refreshCountries()}
    
  }
  
  FormsValues(producto:Producto){
    console.log("esteee");
    console.log(producto);

    let factura_detalle:FacturaDetalle ={
      producto_id: producto.id,
      cantidad: producto.stock,
      precio: producto.precio,
      nombre: `${producto.modelo} - ${producto.marca}`,
      descripcion: producto.descripcion,
      porcentaje: 0,
      // comision: producto.comision,
    }
    
    let FacturaCheckout: FacturaCheckout = {...this._CheckoutService.dataStorage}
    FacturaCheckout.factura_detalle = (FacturaCheckout.factura_detalle)? [...FacturaCheckout.factura_detalle, factura_detalle ]: [factura_detalle ]
    
    let precios = FacturaCheckout.factura_detalle.map((producto => producto.precio))
    let comisiones = FacturaCheckout.factura_detalle.map((producto => producto.porcentaje))
    
    let total = precios.reduce((valorAnterior, valor) => valorAnterior + valor)
    // let totalIva = total *0.15
    // let totalFinal = total + totalIva
    
    // FacturaCheckout.iva = totalIva
    FacturaCheckout.monto = total
    
    console.log(FacturaCheckout);
    // console.log(totalIva);
    console.log(total);
    // console.log(totalFinal);
    
    this._CheckoutService.dataStorage = FacturaCheckout
    this.actualizarProducto(producto)
    
    let numeroProductos:FacturaDetalle[] = this._CheckoutService.getProductCheckout()
    this._CheckoutService.numeroProductos.next(numeroProductos.length)
    
    this.modalService.dismissAll()
  }

}
