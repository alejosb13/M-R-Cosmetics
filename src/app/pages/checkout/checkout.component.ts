import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Cliente } from 'app/shared/models/Cliente.model';
import { FacturaCheckout } from 'app/shared/models/FacturaCheckout.model';
import { FacturaDetalle } from 'app/shared/models/FacturaDetalle.model';
import { CheckoutService } from 'app/shared/services/checkout.service';
import { ClientesService } from 'app/shared/services/clientes.service';
import { HelpersService } from 'app/shared/services/helpers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  productos:FacturaDetalle[] = []
  factura:FacturaCheckout
  clientes:Cliente[]
  
  clienteSelected:boolean = false 
  clienteData:Cliente 
  date:string  
  
  
  constructor(
    private _location: Location,
    public _CheckoutService:CheckoutService,
    public _ClientesService:ClientesService,
    public _HelpersService:HelpersService,
  ) {
    this.getProducts()
    this.getcheckout()
    this.getClientes()
    // this.date = this._HelpersService.currentDay()
  }

  ngOnInit(): void {

  }
  
  getClientes(){
    this._ClientesService.getCliente().subscribe((clientes:Cliente[]) => {
      this.clientes = [...clientes]
      this.ValidClienteSelected()
    })
  }
  
  ValidClienteSelected(){
    if(this.factura.cliente_id){
      this.clienteSelected = true
      // console.log(this.factura);
      // console.log(this.clientes);
      this.clienteData = this.clientes.find(cliente => cliente.id == this.factura.cliente_id)
      // console.log(this.clienteData);
      
      if(this.clienteData.categoria.tipo == "A"){
        this.date = this._HelpersService.addDaytoDate(60,'YYYY-MM-DD') 
        // console.log(this._HelpersService.addDaytoDate(15,'YYYY-MM-DD'));
      }
      if(this.clienteData.categoria.tipo == "B"){
        this.date = this._HelpersService.addDaytoDate(45,'YYYY-MM-DD') 
        // console.log(this._HelpersService.addDaytoDate(30,'YYYY-MM-DD'));
      }
      if(this.clienteData.categoria.tipo == "C"){
        this.date = this._HelpersService.addDaytoDate(30,'YYYY-MM-DD') 
        // console.log(this._HelpersService.addDaytoDate(60,'YYYY-MM-DD'));
      }
    }
  }
  
  getProducts(){
    this.productos = this._CheckoutService.getProductCheckout()  
  }
  
  getcheckout(){
    this.factura = this._CheckoutService.getCheckout()
  }
  
  backClicked() {
    this._location.back();
  }
  
  cambiarValores(element:any) {
    let FacturaCheckout:FacturaCheckout = {...this.factura}
    
    //campos defaul
    FacturaCheckout.status_pagado = false
    FacturaCheckout.iva = 0
    FacturaCheckout.estado = 1
    
    if(element.name == "cliente"){  
      FacturaCheckout.cliente_id = Number(element.value)
      this._CheckoutService.CheckoutToStorage(FacturaCheckout)
      
      this.getcheckout()
      this.ValidClienteSelected()
      
      FacturaCheckout.fecha_vencimiento = this._HelpersService.changeformatDate(this.date,'YYYY-MM-DD','YYYY-MM-DD HH:MM:S') 
    }

    if(element.name == "tipo_venta"){
      FacturaCheckout.tipo_venta = Number(element.value)
      this._CheckoutService.CheckoutToStorage(FacturaCheckout)
      this.getcheckout()
    }
  }
  
  deleteProduct(productoCheckout:FacturaDetalle) {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Este producto se eliminará",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34b5b8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._CheckoutService.deleteProductCheckout(productoCheckout);
        this.getProducts()
      }
    })

  }
  
  
  generarfactura(){
    let factura = this._CheckoutService.getCheckout()
    this._CheckoutService.insertFactura(factura).subscribe( data=>{
      console.log(data);
    })
  }
}
