import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthModule } from 'app/auth/auth.module';
import { Auth, UserAuth } from 'app/auth/login/models/auth.model';
import { AuthService } from 'app/auth/login/service/auth.service';
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
  
  userData:UserAuth
  
  constructor(
    private _location: Location,
    public _CheckoutService:CheckoutService,
    private _ClientesService:ClientesService,
    private _HelpersService:HelpersService,
    private _AuthService:AuthService,
    private router:Router,
  ) {}
  
  ngOnInit(): void {
    
    this.getProducts()
    this.getcheckout()
    this.getClientes()
    this.getDataUser()
    
    
  }
  
  getClientes(){
    this._ClientesService.getCliente().subscribe((clientes:Cliente[]) => {
      this.clientes = [...clientes]
      this.ValidClienteSelected()
    })
  }
  
  getDataUser(){
    this.userData = this._AuthService.dataStorage.user 
  }
  
  ValidClienteSelected(){
    if(this.factura.cliente_id){
      this.clienteSelected = true
      // console.log(this.factura);
      // console.log(this.clientes);
      this.clienteData = this.clientes.find(cliente => cliente.id == this.factura.cliente_id)
      console.log(this.clienteData);
      
      this.date = this._HelpersService.addDaytoDate(Number(this.clienteData.frecuencia.dias),'YYYY-MM-DD') 
        
      // if(this.clienteData.categoria.tipo == "A"){
      //   this.date = this._HelpersService.addDaytoDate(60,'YYYY-MM-DD') 
      //   // console.log(this._HelpersService.addDaytoDate(15,'YYYY-MM-DD'));
      // }
      // if(this.clienteData.categoria.tipo == "B"){
      //   this.date = this._HelpersService.addDaytoDate(45,'YYYY-MM-DD') 
      //   // console.log(this._HelpersService.addDaytoDate(30,'YYYY-MM-DD'));
      // }
      // if(this.clienteData.categoria.tipo == "C"){
      //   this.date = this._HelpersService.addDaytoDate(30,'YYYY-MM-DD') 
      //   // console.log(this._HelpersService.addDaytoDate(60,'YYYY-MM-DD'));
      // }
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
    
    if(element.name == "cliente"){  
      FacturaCheckout.cliente_id = Number(element.value)
      this._CheckoutService.CheckoutToStorage(FacturaCheckout)
      
      this.getcheckout()
      this.ValidClienteSelected()
    }

    if(element.name == "tipo_venta"){
      FacturaCheckout.tipo_venta = Number(element.value)
      this._CheckoutService.CheckoutToStorage(FacturaCheckout)
      
      this.getcheckout()
    }
    
  }
  
  deleteProduct(productoCheckout:FacturaDetalle) {
    console.log(productoCheckout);
    
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
        this.getcheckout()
      }
    })

  }
  
  
  generarfactura(){
    
    if(!this.hasErrorValidation()){
      let FacturaCheckout:FacturaCheckout = {...this.factura}
    
      FacturaCheckout.fecha_vencimiento = this._HelpersService.changeformatDate(this.date,'YYYY-MM-DD','YYYY-MM-DDThh:mm:ss') 
      FacturaCheckout.user_id = this.userData.userId
      FacturaCheckout.status_pagado = FacturaCheckout.tipo_venta == 1? false : true
      FacturaCheckout.iva = 0
      FacturaCheckout.estado = 1
      
      this._CheckoutService.CheckoutToStorage(FacturaCheckout)
      this.getcheckout()
      console.log(this.factura);
      
      this._CheckoutService.insertFactura(this.factura).subscribe( data=>{
        this._CheckoutService.vaciarCheckout()
        
        if(data.status){
          Swal.fire({
            title: '¡Pedido Generado!',
            text: "Su pedido fue generado con exito",
            icon: 'success',
            confirmButtonColor: '#34b5b8',
            confirmButtonText: 'Ok',
            
          }).then((result) => {
            return this.router.navigateByUrl(`/factura/detalle/${data.factura_id}`);
          })
        }else{
          Swal.fire({
            title: 'Error',
            text: "Error generando la factura",
            icon: 'error',
            
          })
        }
      },
      
      (errorResponse:HttpErrorResponse)=>{
        console.log(errorResponse);
        
        Swal.fire({
          title: 'Error',
          text: errorResponse.error.mensaje,
          icon: 'error',
          
        })
      })
    }

  }
  
  private hasErrorValidation():boolean{
    let error:boolean = false;
    let mensaje:string = "";
    let FacturaCheckout:FacturaCheckout = {...this.factura}
    
    if(!FacturaCheckout.tipo_venta){
      mensaje = "Seleccione la operacion de pago."
      error = true
    }

    if(!FacturaCheckout.cliente_id){
      mensaje = "Seleccione un cliente."
      error = true
    }
    
    if(error){
      Swal.fire({
        title: '¡Error!',
        text: mensaje,
        icon: 'warning',
        confirmButtonColor: '#34b5b8',
        confirmButtonText: 'Volver'
      })
    }
    
    return error;
    
  }
}
