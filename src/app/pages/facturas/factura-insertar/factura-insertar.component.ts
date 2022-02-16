import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Cliente } from 'app/shared/models/Cliente.model';
import { FacturaCheckout } from 'app/shared/models/FacturaCheckout.model';
import { FacturaDetalle } from 'app/shared/models/FacturaDetalle.model';
import { Producto } from 'app/shared/models/Producto.model';
import { Usuario } from 'app/shared/models/Usuario.model';
import { ClientesService } from 'app/shared/services/clientes.service';
import { FacturasService } from 'app/shared/services/facturas.service';
import { ProductosService } from 'app/shared/services/productos.service';
import { UsuariosService } from 'app/shared/services/usuarios.service';

@Component({
  selector: 'app-factura-insertar',
  templateUrl: './factura-insertar.component.html',
  styleUrls: ['./factura-insertar.component.css']
})
export class FacturaInsertarComponent implements OnInit {
  
  @ViewChild('modalProducto') modalP: ElementRef<any>;
  modalOptions:NgbModalOptions;
  
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
      this.isLoad =false
    },(error)=>{
      this.isLoad =false
    }) 
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
    
    let FacturaCheckout: FacturaCheckout = {...this._FacturasService.FacturaCheckout}

    if(name == "usuario" ) {
      FacturaCheckout.user_id =  Number(value)
      FacturaCheckout.userFullName = optionSeleccionado.text
    }
    
    if(name == "cliente" ){
      FacturaCheckout.cliente_id =  Number(value)
      FacturaCheckout.clienteFullName =  optionSeleccionado.text
    }
    
    this._FacturasService.FacturaCheckout = {...FacturaCheckout}
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
      porcentaje: producto.comision,
    }
    
    let FacturaCheckout: FacturaCheckout = {...this._FacturasService.FacturaCheckout}
    console.log(FacturaCheckout.factura_detalle);
    
    FacturaCheckout.user_id = 1
    FacturaCheckout.cliente_id = 1
    FacturaCheckout.factura_detalle = (FacturaCheckout.factura_detalle)? [...FacturaCheckout.factura_detalle, factura_detalle ]: [factura_detalle ]

    console.log(FacturaCheckout);
    
    this._FacturasService.FacturaCheckout = FacturaCheckout
    // this._FacturasService.FacturaCheckout = producto
    
    this.modalService.dismissAll()
  }

}
